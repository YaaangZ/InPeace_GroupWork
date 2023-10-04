from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, String, ForeignKey, Float, ARRAY
from sqlalchemy.orm import relationship
from geoalchemy2 import Geometry
from config.db import db


class FullStreet(db.Model):
    __tablename__ = 'fullstreets'

    street_id = Column('street_id', Integer, primary_key=True)
    street_name = Column('street_name', String)
    geometry = Column('geometry', Geometry('MULTILINESTRING'))

    segments = relationship('StreetSegment', backref='street')
    zones_crossed = relationship('StreetZones', uselist=False, viewonly=True)


class StreetSegment(db.Model):
    __tablename__ = 'streetsegments'

    street_id = Column('street_id', Integer, ForeignKey('fullstreets.street_id'), primary_key=True)
    zone_id = Column('zone_id', Integer, ForeignKey('zones.zoneid'), primary_key=True)
    geometry = Column('geometry', Geometry('MULTILINESTRING'))
    length = Column('length_m', Float)


class Place(db.Model):
    __tablename__ = 'places'

    place_id = db.Column('place_id', db.String, primary_key=True)
    place_name = db.Column('place_name', db.String(100), nullable=False)
    geometry = db.Column('location', Geometry(geometry_type='POINT'), nullable=False)
    zone_id = db.Column('zone_id', db.Integer, nullable=True)
    street_id = db.Column('street_id', db.Integer, nullable=True)


class Zone(db.Model):
    __tablename__ = 'zones'

    zone_id = Column('zoneid', Integer, primary_key=True)
    zone_name = Column('zonename', String(200))
    geometry = Column('geometry', Geometry('MUTLIPOLYGON'))


class StreetZones(db.Model):
    __tablename__ = 'street_zones'
    __table_args__ = {'extend_existing': True}

    street_id = db.Column('street_id', db.Integer, db.ForeignKey('fullstreets.street_id'), primary_key=True)
    zone_ids = db.Column('zone_ids', ARRAY(db.Integer))
