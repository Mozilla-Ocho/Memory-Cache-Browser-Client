#! /usr/bin/env sh

# Use basename to get this file's parent directory
DIR=$(dirname "$0")
PARENT_DIR=$(dirname "$DIR")

rm -r $PARENT_DIR/src/api
rm $PARENT_DIR/openapi.json

wget http://localhost:4444/openapi.json -O $PARENT_DIR/openapi.json
yarn dlx @openapitools/openapi-generator-cli generate -i $PARENT_DIR/openapi.json -g typescript-fetch -o $PARENT_DIR/src/api
