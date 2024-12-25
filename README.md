
# Ticketing

This is my pet project where I want to apply my ideas.  
My first bucket list idea is to apply some stress tests (e2e) where I want to identify weaknesses, bottlenecks, and other potential issues.  
The second is to integrate Redis.
After that I want to scaffold a good client side on latest next version and maybe add some features to project facing new challenges.

## Run Locally

First you need to install the Gateway API resources

```bash
  kubectl kustomize "https://github.com/nginxinc/nginx-gateway-fabric/config/crd/gateway-api/standard?ref=v1.5.0" | kubectl apply -f -
```

Deploy the NGINX Gateway Fabric CRDs

```bash
  kubectl apply -f https://raw.githubusercontent.com/nginxinc/nginx-gateway-fabric/v1.5.0/deploy/crds.yaml
```

Deploy NGINX Gateway Fabric

```bash
  kubectl apply -f https://raw.githubusercontent.com/nginxinc/nginx-gateway-fabric/v1.5.0/deploy/default/deploy.yaml
```

Start project

```bash
  skaffold dev
```

After all you have to add ticketing.rus to your hosts or just remove hostnames line in ./infra/k8s/httpRoute.yml file.  
http://ticketing.rus or http://localhost on your browser

## Appendix

You may encounter some errors related to [this unfixed issue](https://github.com/tulios/kafkajs/issues/815). In such cases you have to delete the affected pods and k8s deployments can recreate them.

