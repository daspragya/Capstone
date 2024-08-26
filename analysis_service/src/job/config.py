from pydantic_settings import BaseSettings


class JobConfig(BaseSettings):
    JD_UPLOAD_DIR: str = "./job_description/"

job_config = JobConfig()
