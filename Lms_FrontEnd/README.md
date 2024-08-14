configuration and setting for sortings imports

# install eslint-plugin-simple-import-sort
npm i eslint-plugin-simple-import-sort.

# add plugin in eslientrc.cjs file
simple-import-sort

# add rule in eslientrc.cjs file
'simple-import-sort/imports':'error'

# add a new setting configuration in setting.json file of vs code

"editor.codeActionsOnSave": {
        "source.fixAll.eslint": "always",
    },