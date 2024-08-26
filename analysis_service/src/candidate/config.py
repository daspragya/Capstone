import os

from pydantic_settings import BaseSettings


class CandidateConfig(BaseSettings):

    CV_UPLOAD_DIR: str = "./candidate_cv/"


candidate_config = CandidateConfig()
