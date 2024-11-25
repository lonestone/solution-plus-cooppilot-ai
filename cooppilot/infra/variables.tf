variable "app_name" {
  type = string
}

variable "region" {
  type = string
}

variable "access_key" {
  type    = string
  default = null
}

variable "secret_key" {
  type    = string
  default = null
}

variable "back_end_documents_bucket_name" {
  type    = string
  default = null
}
variable "back_end_ecr_name" {
  type        = string
  description = "Name of the ECR to use for the back-end"
  default     = null
}
variable "rag_ecr_name" {
  type        = string
  description = "Name of the ECR to use for the RAG"
  default     = null
}

variable "db_instance_class" {
  type = string
}

variable "db_name" {
  type = string
}
variable "db_user" {
  type = string
}

variable "db_pwd" {
  type      = string
  sensitive = true
}

variable "awsRuntimeAccessKeyId" {
  type      = string
  sensitive = true
}
variable "awsRuntimeSecretAccessKey" {
  type      = string
  sensitive = true
}

variable "openai_api_key" {
  type      = string
  sensitive = true
}

variable "harvest_access_token" {
  type      = string
  sensitive = true
}

variable "forecast_account_id" {
  type      = string
  sensitive = true
}

variable "forecast_api_url" {
  type = string
}

# CoopPilot

variable "cooppilot_db_name" {
  type = string
}
variable "cooppilot_organization_id" {
  type = string
}
