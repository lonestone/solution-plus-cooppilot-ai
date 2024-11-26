## Back CoopPilot

# Docker Build/Push

from `./apps/cooppilot-back`:

```
aws ecr get-login-password --region eu-west-3 | docker login --username AWS --password-stdin 590183784519.dkr.ecr.eu-west-3.amazonaws.com
docker build -f Dockerfile -t 590183784519.dkr.ecr.eu-west-3.amazonaws.com/cooppilot-back_cooppilot:latest ./..
docker push 590183784519.dkr.ecr.eu-west-3.amazonaws.com/cooppilot-back_cooppilot:latest
```

# Kill task on ECS to trigger a new task instance
