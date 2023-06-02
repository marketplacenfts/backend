#!/bin/bash

### Do migrations ###
cd src/
npx sequelize db:migrate 

### Run backend ###
echo "MODE value during run: $MODE"

if [ "${MODE}" == "prod" ]; then
    ### Run backend on prod mode ###
    npm run prod
else
    ### Run backend on developer mode ###
    npm run dev
fi
