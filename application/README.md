# Demonstrate HLF operation using Fabric NodeJS SDK
To help customers get started with executing Hyperldger Native commands on their network, we are providing some sample scripts using fabric NodeJS SDK. Through these sample scripts, you can create new user identities, and install your own chaincode.


1. [ Prerequisites ](#prerequisites)
2. [ User identity generation ](#fabricca)
3. [ Chaincode operation ](#chaincode)

<a name="prerequisites"></a>
## Prerequisites

<a name="fabricca"></a>
## User identity generation
Execute below commands if you want to generate new user identites for the your HLF organization. 

These commands can be execute either from Azure CLI or any local machine which meet the above mentioned prerequisites.

**1. Generate connection profile and admin profile**\
Generate connection profile and admin profile of the organization using the steps mentioned here. 

Create a folder named 'profile' 
mkdir ./profile

Upload connection profile and Admin profile on Azure CLI using download button

Download button always load the files in your home directory. Move these file to the 'profile' folder created above.
```
mv ~/gateway.json ./profile/$ORGNAME-ccp.json
mv ~/admin.json ./profile/$ORGNAME-admin.json
```
It will copy connection profile and Admin Profile inside the 'profile' folder with name '{orgname}-ccp.json' and '{orgname}-admin.json' respectively.

**2. Enroll Admin User**\
Download enrollAdmin.js using below command
```
curl https://raw.githubusercontent.com/ravastra/ARM-template-for-Hyperledger-Fabric-based-on-AKS/shr-nodejs-app/application/loadAdminUser.js -o loadAdminUser.js
```
Execute below command to enroll the Admin user. 
```
npm run enrollAdmin
```
This command executes enrollAdmin.js script to enroll the admin user. The scripts reads admin identity from the admin profile '<orname>-admin.json' and stores it in wallet for further use.\
\
The script use file system wallet to store the identites. It creates a wallet as per the path specified in ".wallet" property in the connection profile './{orgname}-ccp.json'. By default, ".wallet" property is initalizaed with '{orgname}', which means a folder named '{orgname}' is created in your directory to store the identities. If you want to store identites at some other path, please modify ".wallet" property in connection profile before running enroll admin user command.\
 \
 So, once the admin erollement is done successfully, it will store admin identities in the wallet created at "./{orgname}" path.
  
  
**3. Register New User**\
Download registerUser.js file using below command
```
curl https://github.com/ravastra/ARM-template-for-Hyperledger-Fabric-based-on-AKS/blob/shr-nodejs-app/application/registerUser.js -o registerUser.js
```
Execute below command to register the new user
```
npm run registerUser --username <identity_username>
```

<a name="chaincode"></a>
## Chaincode operation:
