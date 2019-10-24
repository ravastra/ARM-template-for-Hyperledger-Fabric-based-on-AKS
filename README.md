# ARM-template-for-Hyperledger-Fabric-based-on-AKS
To help customers get started with their HLF setup we are an ARM template to deploy the Ordering Service and Oraganization with peer nodes. Preview customers would be able to access this template on Azure Marketplace. 
Post deployment a script is provided to create consortium, create channel, install, invoke chaincode on peer nodes etc. All the details related to the various action supported by the Build your network (byn) scripts are available in the User guide attached. 


1. [ Onboarding to Preview ](#onboarding)
2. [ Support Forum ](#support)
3. [ Hyperledger Fabric Blockchain network setup ](#networksetup)

<a name="onboarding"></a>
## 1. Onboarding to Preview
The Azure Blockchain for Hyperledger Fabric (AKS based) template is enabled in Azure Marketplace for private preview customers only. Customers whose subscriptions are whitelisted by Microsoft team will be able to access the template. 
To get yourself onboarded to the private preview please mail your subscription ID details along with your organization details to azbchlf@microsoft.com 

<a name="support"></a>
## 2. Support Forum
All the private preview customers will be added to the teams channel Azure Blockchain Previews > Hyperledger Fabric AKS template preview. Customers can send out their queries/requests on this channel, we will be able to reply to your queries daily. 
Note: Please indicate if you do not want to be added to the support forum teams channel by sending a mail to azbchlf@microsoft.com  

<a name="networksetup"></a>
## 3. Hyperledger Fabric Blockchain network setup
The Fabric deployment through this template mainly involves 2 major steps
- [ Deploy the orderer/peer organizations ](#deployorganization)
- [ Build the consortium ](#buildconsortium)

<a name="deployorganization"></a>
### Deploy the orderer/peer organization
To get started with the HLF network components deployment, navigate to Azure portal marketplace offering link here https://aka.ms/hlf

1. Click on create to start the template deployment 


<a name="buildconsortium"></a>
### Build the consortium
