#File that generates list of cards from gatherer and parses.

require 'rubygems'

require 'nokogiri'
require 'open-uri'
require 'ruby-debug'

set = 'dtk'

rarity_symbols = {'C' => 'commons', 'U' => 'uncommons', 'R' => 'rares', 'M' => 'mythics'}
rarity_lists = {'C' => [], 'U' => [], 'R' => [], 'M' => []}

0.upto(2) do |ind|
  url_to_hit = "http://gatherer.wizards.com/Pages/Search/Default.aspx?page=#{ind}&output=checklist&action=advanced&set=[%22Dragons%20of%20Tarkir%22]"
  #url_to_hit = "http://gatherer.wizards.com/Pages/Search/Default.aspx?output=checklist&action=advanced&set=[%22Fate%20Reforged%22]"

  doc = Nokogiri::HTML(open(url_to_hit))
  
  puts doc.inspect
  
  subdoc = doc.xpath("//tr[@class='cardItem']")

  
  ['C', 'U', 'R', 'M'].each do |rarity|
    subsubdoc = subdoc.select{|i| i.children[4].children.text == rarity}
    things = subsubdoc.map{|i| i.children[1].children.children.text}
    rarity_lists[rarity] += things
  end
end

['C', 'U', 'R', 'M'].each do |rarity|
  list_file = File.open((set+rarity_symbols[rarity]+'.txt'), 'w+')
  list_file << rarity_lists[rarity].join("\n")
  #things.each{|thing| list_file << thing+"\n"}
  list_file.close
  puts rarity_lists[rarity].size
  puts "------"
end