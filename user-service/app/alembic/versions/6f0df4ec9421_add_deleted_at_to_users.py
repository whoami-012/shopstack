"""add deleted_at to users

Revision ID: 6f0df4ec9421
Revises: d044a53d96e2
Create Date: 2026-03-07 15:40:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "6f0df4ec9421"
down_revision: Union[str, Sequence[str], None] = "d044a53d96e2"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("users", sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True))


def downgrade() -> None:
    op.drop_column("users", "deleted_at")
