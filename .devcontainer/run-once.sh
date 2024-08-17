#!/usr/bin/env bash

git config --local core.hooksPath ./githooks
chmod +x .githooks/*

# Since Docker is based on Linux, other platform can be slowed
# one solution is to create a symlink to the node_modules folder
if [ -d "node_modules" ]; then
  rm -rf node_modules
fi

# Always try to make the dir in the parent.
# The -p option will stop it complaining if it already exists
mkdir -p /home/node/node_modules

# Create a symlink to the node_modules folder
if [ ! -L "node_modules" ]; then
  ln -s /home/node/node_modules node_modules
fi

git config --global --replace-all safe.directory /home/node/workspace