"""Migracion inicial

Revision ID: 6ab833ac383d
Revises: 
Create Date: 2024-09-26 20:11:37.902768

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '6ab833ac383d'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('nodos',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('type', sa.Integer(), nullable=False),
    sa.Column('data', sa.String(), nullable=False),
    sa.Column('time', sa.Float(), nullable=False),
    sa.Column('fecha_creacion', sa.DateTime(), nullable=True),
    sa.Column('fecha_modificacion', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_nodos_id'), 'nodos', ['id'], unique=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_nodos_id'), table_name='nodos')
    op.drop_table('nodos')
    # ### end Alembic commands ###