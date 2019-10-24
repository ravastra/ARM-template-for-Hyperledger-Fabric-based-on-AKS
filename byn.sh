#!/bin/bash

#import utils
. /var/hyperledger/consortiumScripts/utils.sh

hlfStatus=$(kubectl get configmap hlf-status -o jsonpath={.data.hlfStatus})
if [ ! "$hlfStatus" == "Done" ]; then
  res=1
  verifyResult $res "HLF Organization is not setup yet. Can't run the script."
fi
kubectl apply -f /var/hyperledger/deployments/fabric-admin.yaml
theargs=""
for i in "$@" ; do
   theargs="${theargs} \"$i\""
done
kubectl wait --for=condition=Ready pod -l name=fabric-admin --timeout=300s &> log.txt
res=$?
verifyResult $res "Failed to start fabric-admin pod"
echo
echo "======== Started fabric-admin pod!!! =========="
echo

FABRIC_ADMIN_POD=$(kubectl get pods -l name=fabric-admin -ojsonpath={.items[0].metadata.name})
kubectl exec ${FABRIC_ADMIN_POD} -- bash -c "/var/hyperledger/consortiumScripts/byn2.sh ${theargs}"
kubectl delete pod ${FABRIC_ADMIN_POD} &> log.txt
res=$?
verifyResult $res "Deletion of fabric-admin pod Failed"
echo
echo "======== Deleted fabric-admin pod!!! =========="
echo
