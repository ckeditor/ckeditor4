###
# MIT LICENSE
# Copyright (c) 2011 Devon Govett
# 
# Permission is hereby granted, free of charge, to any person obtaining a copy of this 
# software and associated documentation files (the "Software"), to deal in the Software 
# without restriction, including without limitation the rights to use, copy, modify, merge, 
# publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons 
# to whom the Software is furnished to do so, subject to the following conditions:
# 
# The above copyright notice and this permission notice shall be included in all copies or 
# substantial portions of the Software.
# 
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING 
# BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
# NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, 
# DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
###

class PNG
    @load: (url, canvas, callback) ->
        callback = canvas if typeof canvas is 'function'
    
        xhr = new XMLHttpRequest
        xhr.open("GET", url, true)
        xhr.responseType = "arraybuffer"
        xhr.onload = =>
            data = new Uint8Array(xhr.response or xhr.mozResponseArrayBuffer)
            png = new PNG(data)
            png.render(canvas) if typeof canvas?.getContext is 'function'
            callback?(png)
            
        xhr.send(null)
        
    APNG_DISPOSE_OP_NONE = 0
    APNG_DISPOSE_OP_BACKGROUND = 1
    APNG_DISPOSE_OP_PREVIOUS = 2
    APNG_BLEND_OP_SOURCE = 0
    APNG_BLEND_OP_OVER = 1
    
    constructor: (@data) ->
        @pos = 8  # Skip the default header
        
        @palette = []
        @imgData = []
        @transparency = {}
        @animation = null
        @text = {}
        frame = null
        
        loop
            chunkSize = @readUInt32()
            section = (String.fromCharCode @data[@pos++] for i in [0...4]).join('')
            
            switch section
                when 'IHDR'
                    # we can grab  interesting values from here (like width, height, etc)
                    @width = @readUInt32()
                    @height = @readUInt32()
                    @bits = @data[@pos++]
                    @colorType = @data[@pos++]
                    @compressionMethod = @data[@pos++]
                    @filterMethod = @data[@pos++]
                    @interlaceMethod = @data[@pos++]
                    
                when 'acTL'
                    # we have an animated PNG
                    @animation = 
                        numFrames: @readUInt32()
                        numPlays: @readUInt32() or Infinity
                        frames: []
                    
                when 'PLTE'
                    @palette = @read(chunkSize)
                    
                when 'fcTL'
                    @animation.frames.push(frame) if frame
                
                    @pos += 4 # skip sequence number
                    frame = 
                        width: @readUInt32()
                        height: @readUInt32()
                        xOffset: @readUInt32()
                        yOffset: @readUInt32()
                        
                    delayNum = @readUInt16()
                    delayDen = @readUInt16() or 100
                    frame.delay = 1000 * delayNum / delayDen
                    
                    frame.disposeOp = @data[@pos++]
                    frame.blendOp = @data[@pos++]
                    frame.data = []
                    
                when 'IDAT', 'fdAT'
                    if section is 'fdAT'
                        @pos += 4 # skip sequence number
                        chunkSize -= 4
                    
                    data = frame?.data or @imgData
                    for i in [0...chunkSize]
                        data.push @data[@pos++]
                        
                when 'tRNS'
                    # This chunk can only occur once and it must occur after the
                    # PLTE chunk and before the IDAT chunk.
                    @transparency = {}
                    switch @colorType
                        when 3
                            # Indexed color, RGB. Each byte in this chunk is an alpha for
                            # the palette index in the PLTE ("palette") chunk up until the
                            # last non-opaque entry. Set up an array, stretching over all
                            # palette entries which will be 0 (opaque) or 1 (transparent).
                            @transparency.indexed = @read(chunkSize)
                            short = 255 - @transparency.indexed.length
                            if short > 0
                                @transparency.indexed.push 255 for i in [0...short]
                        when 0
                            # Greyscale. Corresponding to entries in the PLTE chunk.
                            # Grey is two bytes, range 0 .. (2 ^ bit-depth) - 1
                            @transparency.grayscale = @read(chunkSize)[0]
                        when 2
                            # True color with proper alpha channel.
                            @transparency.rgb = @read(chunkSize)
                            
                when 'tEXt'
                    text = @read(chunkSize)                    
                    index = text.indexOf(0)
                    key = String.fromCharCode text.slice(0, index)...
                    @text[key] = String.fromCharCode text.slice(index + 1)...
                            
                when 'IEND'
                    @animation.frames.push(frame) if frame
                
                    # we've got everything we need!
                    @colors = switch @colorType
                        when 0, 3, 4 then 1
                        when 2, 6 then 3
                    
                    @hasAlphaChannel = @colorType in [4, 6]
                    colors = @colors + if @hasAlphaChannel then 1 else 0    
                    @pixelBitlength = @bits * colors
                        
                    @colorSpace = switch @colors
                        when 1 then 'DeviceGray'
                        when 3 then 'DeviceRGB'
                    
                    @imgData = new Uint8Array @imgData                        
                    return
                    
                else
                    # unknown (or unimportant) section, skip it
                    @pos += chunkSize
                    
            @pos += 4 # Skip the CRC
            
            if @pos > @data.length
                throw new Error "Incomplete or corrupt PNG file"
            
        return
        
    read: (bytes) ->
        (@data[@pos++] for i in [0...bytes])
    
    readUInt32: ->
        b1 = @data[@pos++] << 24
        b2 = @data[@pos++] << 16
        b3 = @data[@pos++] << 8
        b4 = @data[@pos++]
        b1 | b2 | b3 | b4
        
    readUInt16: ->
        b1 = @data[@pos++] << 8
        b2 = @data[@pos++]
        b1 | b2
        
    decodePixels: (data = @imgData) -> 
        return new Uint8Array(0) if data.length is 0
        
        data = new FlateStream(data)
        data = data.getBytes()
        pixelBytes = @pixelBitlength / 8
        scanlineLength = pixelBytes * @width

        pixels = new Uint8Array(scanlineLength * @height)
        length = data.length
        row = 0
        pos = 0
        c = 0
        
        while pos < length
            switch data[pos++]
                when 0 # None
                    for i in [0...scanlineLength] by 1
                        pixels[c++] = data[pos++]

                when 1 # Sub
                    for i in [0...scanlineLength] by 1
                        byte = data[pos++]
                        left = if i < pixelBytes then 0 else pixels[c - pixelBytes]
                        pixels[c++] = (byte + left) % 256

                when 2 # Up
                    for i in [0...scanlineLength] by 1
                        byte = data[pos++]
                        col = (i - (i % pixelBytes)) / pixelBytes
                        upper = row && pixels[(row - 1) * scanlineLength + col * pixelBytes + (i % pixelBytes)]
                        pixels[c++] = (upper + byte) % 256

                when 3 # Average
                    for i in [0...scanlineLength] by 1
                        byte = data[pos++]
                        col = (i - (i % pixelBytes)) / pixelBytes
                        left = if i < pixelBytes then 0 else pixels[c - pixelBytes]
                        upper = row && pixels[(row - 1) * scanlineLength + col * pixelBytes + (i % pixelBytes)]
                        pixels[c++] = (byte + Math.floor((left + upper) / 2)) % 256

                when 4 # Paeth
                    for i in [0...scanlineLength] by 1
                        byte = data[pos++]
                        col = (i - (i % pixelBytes)) / pixelBytes
                        left = if i < pixelBytes then 0 else pixels[c - pixelBytes]

                        if row is 0
                            upper = upperLeft = 0
                        else
                            upper = pixels[(row - 1) * scanlineLength + col * pixelBytes + (i % pixelBytes)]
                            upperLeft = col && pixels[(row - 1) * scanlineLength + (col - 1) * pixelBytes + (i % pixelBytes)]

                        p = left + upper - upperLeft
                        pa = Math.abs(p - left)
                        pb = Math.abs(p - upper)
                        pc = Math.abs(p - upperLeft)

                        if pa <= pb and pa <= pc
                            paeth = left
                        else if pb <= pc
                            paeth = upper
                        else
                            paeth = upperLeft

                        pixels[c++] = (byte + paeth) % 256

                else
                    throw new Error "Invalid filter algorithm: " + data[pos - 1] 

            row++
            
        return pixels
        
    decodePalette: ->
        palette = @palette
        transparency = @transparency.indexed or []
        ret = new Uint8Array((transparency.length or 0) + palette.length)
        pos = 0
        length = palette.length
        c = 0
        
        for i in [0...palette.length] by 3
            ret[pos++] = palette[i]
            ret[pos++] = palette[i + 1]
            ret[pos++] = palette[i + 2]
            ret[pos++] = transparency[c++] ? 255
            
        return ret
        
    copyToImageData: (imageData, pixels) ->
        colors = @colors
        palette = null
        alpha = @hasAlphaChannel
        
        if @palette.length
            palette = @_decodedPalette ?= @decodePalette()
            colors = 4
            alpha = true
        
        data = imageData.data
        length = data.length
        input = palette or pixels
        i = j = 0
        
        if colors is 1
            while i < length
                k = if palette then pixels[i / 4] * 4 else j
                v = input[k++]
                data[i++] = v
                data[i++] = v
                data[i++] = v
                data[i++] = if alpha then input[k++] else 255
                j = k
        else
            while i < length
                k = if palette then pixels[i / 4] * 4 else j
                data[i++] = input[k++]
                data[i++] = input[k++]
                data[i++] = input[k++]
                data[i++] = if alpha then input[k++] else 255
                j = k
            
        return
        
    decode: ->
        ret = new Uint8Array(@width * @height * 4)
        @copyToImageData ret, @decodePixels()
        return ret
        
    scratchCanvas = document.createElement 'canvas'
    scratchCtx = scratchCanvas.getContext '2d'
    makeImage = (imageData) ->
        scratchCtx.width = imageData.width
        scratchCtx.height = imageData.height
        scratchCtx.clearRect(0, 0, imageData.width, imageData.height)
        scratchCtx.putImageData(imageData, 0, 0)
            
        img = new Image
        img.src = scratchCanvas.toDataURL()
        return img
        
    decodeFrames: (ctx) ->
        return unless @animation
        
        for frame, i in @animation.frames
            imageData = ctx.createImageData(frame.width, frame.height)
            pixels = @decodePixels(new Uint8Array(frame.data))
            
            @copyToImageData(imageData, pixels)
            frame.imageData = imageData
            frame.image = makeImage(imageData)
        
    renderFrame: (ctx, number) ->
        frames = @animation.frames
        frame = frames[number]
        prev = frames[number - 1]
        
        # if we're on the first frame, clear the canvas
        if number is 0
            ctx.clearRect(0, 0, @width, @height)
        
        # check the previous frame's dispose operation
        if prev?.disposeOp is APNG_DISPOSE_OP_BACKGROUND
            ctx.clearRect(prev.xOffset, prev.yOffset, prev.width, prev.height)
            
        else if prev?.disposeOp is APNG_DISPOSE_OP_PREVIOUS
            ctx.putImageData(prev.imageData, prev.xOffset, prev.yOffset)
        
        # APNG_BLEND_OP_SOURCE overwrites the previous data
        if frame.blendOp is APNG_BLEND_OP_SOURCE
            ctx.clearRect(frame.xOffset, frame.yOffset, frame.width, frame.height)
        
        # draw the current frame
        ctx.drawImage(frame.image, frame.xOffset, frame.yOffset)   
        
    animate: (ctx) ->
        frameNumber = 0
        {numFrames, frames, numPlays} = @animation
        
        do doFrame = =>
            f = frameNumber++ % numFrames
            frame = frames[f]
            @renderFrame(ctx, f)
            
            if numFrames > 1 and frameNumber / numFrames < numPlays
                @animation._timeout = setTimeout(doFrame, frame.delay)
                
    stopAnimation: ->
        clearTimeout @animation?._timeout
    
    render: (canvas) ->
        # if this canvas was displaying another image before,
        # stop the animation on it
        if canvas._png
            canvas._png.stopAnimation()
        
        canvas._png = this
        canvas.width = @width
        canvas.height = @height
        ctx = canvas.getContext "2d"
        
        if @animation
            @decodeFrames(ctx)
            @animate(ctx)
        
        else
            data = ctx.createImageData @width, @height
            @copyToImageData data, @decodePixels()
            ctx.putImageData data, 0, 0

window.PNG = PNG