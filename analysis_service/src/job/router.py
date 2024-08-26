from fastapi import APIRouter, File, UploadFile,Form
from src.job import service
from src.job.schemas import JobSchema, ResponseSchema

router = APIRouter()


# @router.post("/analyse", response_model=ResponseSchema)
@router.post("/analyse")
async def analyse_job(file: UploadFile = File(...)):

    file_name = await service.save_jd_job(file=file)

    cv_content = service.read_jd_job(file_name=file_name)

    result = service.analyse_job(cv_content=cv_content)

    return result
