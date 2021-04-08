#!/bin/bash
# -------------------------------------------------------------------------
# Here is what we did to set this all up...
#rm package*
#npm init
# npm init creates a package.json
# http://browsenpm.org/package.json
# https://docs.npmjs.com/files/package.json
# Take the defaults here

# We are adding libraries, they will be in our local node_modules
npm install
npm run build
#npm install express
#npm install pg
npm install @material-ui/lab
# check out the package.json now
# check out node_modules

psql "dbname='webdb' user='webdbuser' password='password' host='localhost'" -f db/schema.sql
