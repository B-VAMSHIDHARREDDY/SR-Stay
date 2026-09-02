import uuid

from pydantic import BaseModel, ConfigDict, Field


class AmenityOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str


class AmenityCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
