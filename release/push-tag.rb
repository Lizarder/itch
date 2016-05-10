#!/usr/bin/env ruby

require_relative 'common'

force = false

def prompt (msg)
  print "#{msg}: "
  $stdout.flush
  gets.strip
end

def yesno (msg)
  print "#{msg} (y/n) "
  $stdout.flush

  if force
    puts " (forced yes)"
    return
  end

  unless "y" == gets.strip
    print "Bailing out..."
    exit 0
  end
end

pkg_path = File.expand_path(File.join(
  File.dirname(__FILE__), '..', 'package.json'))

pkg = JSON.parse(File.read(pkg_path))
pkg_version = pkg['version']

args = []
ARGV.each do |arg|
  case arg
  when "--force"
    puts "(Running in forced mode)"
    force = true
  when /^--/
    raise "Unknown option #{arg}"
  else
    args << arg
  end
end

version_input = args[0] or prompt "Package version is: #{pkg['version']}, type yours"
unless /^v\d+.\d+.\d+(-canary)?$/ =~ version_input
  raise "Version must be of the form vX.Y.Z(-canary)?"
end

next_version = version_input.gsub(/^v/, '')

if pkg_version != next_version
  yesno "Bump package.json? [#{pkg_version} => #{next_version}]"
  pkg['version'] = next_version
  File.write(pkg_path, JSON.pretty_generate(pkg))
  puts "Bumped package.json"
  system %Q{git add package.json} or raise
  system %Q{git commit -m ':arrow_up: #{next_version}'} or raise
end

tag = "v#{next_version}"
add_cmd = %Q{git tag -a #{tag} -m #{tag}}

if system add_cmd
  puts "Tag added..."
else
  yesno "Tag already exists locally. Replace?"
  system %Q{git tag -d #{tag}} or raise
  system add_cmd or raise
end

push_cmd = %Q{git push origin #{tag}}
if system push_cmd
  puts "Tag pushed..."
else
  yesno "Tag already exists on remote. Force-push?"
  system %Q{#{push_cmd} --force} or raise
end

system %Q{git push} or raise
