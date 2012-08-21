# Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
# For licensing, see LICENSE.html or http://ckeditor.com/license

require "jsduck/meta_tag"
require "jsduck/app"
require "jsduck/doc_formatter"

module JsDuck::Tag

  # Tags to be ignored in documentation.

  class License < Ignore
    def initialize
      super()
      @name = "license"
    end
  end

  class FileOverview < Ignore
    def initialize
      super()
      @name = "fileOverview"
    end
  end

  # Do not ignore @todo like @license and @fileOverview.
  # Just don't print anything.

  class Todo < JsDuck::MetaTag
    def initialize
      @name = "todo"
    end
  end

  # Temporary impl - will eventually print "see" section.

  class See < JsDuck::MetaTag
    def initialize
      @name = "see"
    end
  end

  # Custom @see tag.

  # class See < JsDuck::MetaTag

  #   def initialize
  #     @name = "see"
  #   end

  #   def to_value( raw )
  #     doc_formatter = DocFormatter.new( {}, {} )

  #     raw.map do |link|
  #       doc_formatter.create_magic_links( link )
  #     end.compact
  #   end

  #   def to_html( links )
  #     puts links
  #     # <<-EOHTML
  #     #   <h3 class="pa">See</h3>
  #     #   <ul>
  #     #     <li><a href="#{link}">#{link}</a></li>
  #     #   </ul>
  #     # EOHTML
  #   end
  # end
end