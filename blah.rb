#File that generates list of cards from gatherer and parses.

require 'rubygems'

require 'nokogiri'
require 'open-uri'
require 'ruby-debug'

url_to_hit = "http://gatherer.wizards.com/Pages/Search/Default.aspx?output=checklist&action=advanced&set=[%22Khans%20of%20Tarkir%22]"
url_to_hit = "http://gatherer.wizards.com/Pages/Search/Default.aspx?output=checklist&action=advanced&set=[%22Fate%20Reforged%22]"
set = 'frf'
doc = Nokogiri::HTML(open(url_to_hit))

puts doc.inspect

subdoc = doc.xpath("//tr[@class='cardItem']")

rarity_symbols = {'C' => 'commons', 'U' => 'uncommons', 'R' => 'rares', 'M' => 'mythics'}


['C', 'U', 'R', 'M'].each do |rarity|
  subsubdoc = subdoc.select{|i| i.children[4].children.text == rarity}
  things = subsubdoc.map{|i| i.children[1].children.children.text}
  puts things
  list_file = File.open((set+rarity_symbols[rarity]+'.txt'), 'w+')
  list_file << things.join("\n")
  #things.each{|thing| list_file << thing+"\n"}
  list_file.close
  puts things.size
  puts "------"
end