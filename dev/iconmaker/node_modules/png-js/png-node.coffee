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

fs = require 'fs'
zlib = require 'zlib'

module.exports = class PNG
    @decode: (path, fn) ->
       fs.readFile path, (err, file) ->
           png = new PNG(file)
           png.decode (pixels) ->
               fn pixels
               
    @load: (path) ->
        file = fs.readFileSync path
        return new PNG(file)
    
    constructor: (@data) ->
        @pos = 8  # Skip the default header

        @palette = []
        @imgData = []
        @transparency = {}
        @text = {}

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

                when 'PLTE'
                    @palette = @read(chunkSize)

                when 'IDAT'
                    for i in [0...chunkSize] by 1
                        @imgData.push @data[@pos++]

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

                    @imgData = new Buffer @imgData
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
        
    decodePixels: (fn) ->
        zlib.inflate @imgData, (err, data) =>
            throw err if err
            
            pixelBytes = @pixelBitlength / 8
            scanlineLength = pixelBytes * @width

            pixels = new Buffer(scanlineLength * @height)
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

            fn pixels
        
    decodePalette: ->
        palette = @palette
        transparency = @transparency.indexed or []
        ret = new Buffer(transparency.length + palette.length)
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
        
        data = imageData?.data or imageData
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
        
    decode: (fn) ->
        ret = new Buffer(@width * @height * 4)
        @decodePixels (pixels) =>
            @copyToImageData ret, pixels
            fn ret