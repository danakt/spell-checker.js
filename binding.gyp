{
  "targets": [{
    "target_name": "read-dictionary",
    "sources": ["src/read-dictionary.cpp" ],
    "include_dirs": ["<!(node -e \"require('nan')\")"]
  }]
}
