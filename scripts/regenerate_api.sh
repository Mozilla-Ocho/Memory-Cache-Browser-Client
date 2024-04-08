#! /usr/bin/env sh

# Use basename to get this file's parent directory
PROJECT_ROOT=$(realpath $0 | xargs dirname | xargs dirname)

curl http://localhost:4444/openapi.json > $PROJECT_ROOT/newopenapi.json

if [ ! -f $PROJECT_ROOT/newopenapi.json ]; then
    echo "Did not find new openapi.json."
    exit 0
fi

mkdir -p $PROJECT_ROOT/src/api
rm -r $PROJECT_ROOT/src/api
mkdir -p $PROJECT_ROOT/src/api
mv $PROJECT_ROOT/newopenapi.json $PROJECT_ROOT/openapi.json

yarn openapi-generator-cli generate -i $PROJECT_ROOT/openapi.json -g typescript-fetch -o $PROJECT_ROOT/src/api/
