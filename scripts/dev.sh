# !/bin/bash
PROJECT_ROOT=$(realpath $0 | xargs dirname | xargs dirname)
$PROJECT_ROOT/scripts/clean.sh
$PROJECT_ROOT/scripts/regenerate_api.sh
yarn parcel src/index.html
