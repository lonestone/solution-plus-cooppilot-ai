terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Configure the AWS Provider
provider "aws" {
  region     = var.region
  access_key = var.access_key
  secret_key = var.secret_key
  default_tags {
    tags = {
      Project = var.app_name
      # Environment = "Dev"
    }
  }
}

module "base" {
  source = "../../base/terraform"

  app_name = var.app_name
  region   = var.region

  # forcing some resources name that can't be renamed
  back_end_documents_bucket_name = var.back_end_documents_bucket_name
  back_end_ecr_name              = var.back_end_ecr_name
  rag_ecr_name                   = var.rag_ecr_name

  certificate_arn      = "arn:aws:acm:eu-west-3:869935098087:certificate/d8713abe-d2a4-4236-8a29-0ab696c9cb62"
  back_end_host_header = "api.admin-solution-plus.ai.lonestone.io"

  db_instance_class = var.db_instance_class
  db_user           = var.db_user
  db_pwd            = var.db_pwd
  db_name           = var.db_name

  openai_api_key = var.openai_api_key

  awsRuntimeAccessKeyId     = var.awsRuntimeAccessKeyId
  awsRuntimeSecretAccessKey = var.awsRuntimeSecretAccessKey

  harvest_access_token = var.harvest_access_token
  forecast_account_id  = var.forecast_account_id
  forecast_api_url     = var.forecast_api_url

  additional_services = {}
}
