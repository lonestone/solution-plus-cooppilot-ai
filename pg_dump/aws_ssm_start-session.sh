aws ssm start-session \
  --region eu-west-3 \
  --target ecs:cooppilot-cluster_87200a9f9068418a97492e27fe76902e_87200a9f9068418a97492e27fe76902e-3246523054 \
  --document-name AWS-StartPortForwardingSessionToRemoteHost \
  --parameters '{"host":["cooppilot-back-end-db.c5k2sqskclt9.eu-west-3.rds.amazonaws.com"],"portNumber":["5432"], "localPortNumber":["5432"]}'
