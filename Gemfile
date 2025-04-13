source 'https://rubygems.org'

# You may use http://rbenv.org/ or https://rvm.io/ to install and use this version
ruby '>= 2.6.10'

# Exclude problematic versions of cocoapods and activesupport that causes build failures.
gem 'cocoapods', '>= 1.13', '!= 1.15.0', '!= 1.15.1'
gem 'activesupport', '>= 6.1.7.5', '!= 7.1.0'
gem 'xcodeproj', '< 1.26.0'
gem 'fastlane', '>= 2.226.0'
gem 'fastlane-plugin-firebase_app_distribution'

# iOS Fastlane Pluginfile path
ios_plugins_path = File.join(File.dirname(__FILE__), 'ios', 'fastlane', 'Pluginfile')
eval_gemfile(ios_plugins_path) if File.exist?(ios_plugins_path)

# Android Fastlane Pluginfile path
android_plugins_path = File.join(File.dirname(__FILE__), 'android', 'fastlane', 'Pluginfile')
eval_gemfile(android_plugins_path) if File.exist?(android_plugins_path)