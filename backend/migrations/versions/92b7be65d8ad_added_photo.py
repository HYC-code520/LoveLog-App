"""Added photo

Revision ID: 92b7be65d8ad
Revises: 892c6743692d
Create Date: 2025-02-28 14:21:40.522594

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '92b7be65d8ad'
down_revision = '892c6743692d'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('events', schema=None) as batch_op:
        batch_op.add_column(sa.Column('photo', sa.String(length=500), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('events', schema=None) as batch_op:
        batch_op.drop_column('photo')

    # ### end Alembic commands ###
