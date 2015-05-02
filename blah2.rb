require 'nokogiri'
require 'open-uri'
require 'restclient'

url_to_hit = "http://www.cubetutor.com/viewcube/238"

#doc = Nokogiri::HTML(open(url_to_hit))

doc = Nokogiri::HTML(RestClient.get(url_to_hit))

#subdoc = doc.xpath("//a")#{}"[@class='cardPreview']")
subdoc = doc.css('a.cardPreview')
#puts doc.css('a.cardPreview').inspect

subdoc.each do |sub|
  puts sub.text#.children.inspect
end
#puts subdoc.inspect