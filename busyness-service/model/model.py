from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, DateTime, func, Float
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import relationship
from geoalchemy2 import Geometry
from config.db import db


class Zone(db.Model):
    __tablename__ = 'zones'

    zone_id = Column('zoneid', Integer, primary_key=True)
    zone_name = Column('zonename', String)

    counts = relationship('ZoneCounts', uselist=False, backref='zone')
    streets = relationship('Street', backref='zone')
    places = relationship('Place', backref='zone')
    busyness = relationship('ZoneBusynessPrediction', uselist=False, backref='zone')


class FullStreet(db.Model):
    __tablename__ = 'fullstreets'

    street_id = Column('street_id', Integer, primary_key=True)
    street_name = Column('street_name', String)

    street_segments = relationship('Street', backref='street')


class Street(db.Model):
    __tablename__ = 'streetsegments'

    street_id = Column('street_id', Integer, ForeignKey('fullstreets.street_id'), primary_key=True)
    zone_id = Column('zone_id', Integer, ForeignKey('zones.zoneid'), primary_key=True)
    length_m = Column('length_m', Float)


class Place(db.Model):
    __tablename__ = 'places'

    place_id = Column('place_id', String, primary_key=True)
    place_name = Column('place_name', String)
    zone_id = Column('zone_id', Integer, ForeignKey('zones.zoneid'))
    street_id = Column('street_id', Integer, ForeignKey('fullstreets.street_id'))
    category_id = Column('category_id', Integer, ForeignKey('categories.categoryid'))


class Categories(db.Model):
    __tablename__ = 'categories'

    category_id = Column('categoryid', Integer, primary_key=True)
    category_name = Column('categoryname', String)

    places = relationship('Place', backref='category')
    customer_behavior = relationship('CategoryCustomerBehavior', backref='category')


class CategoryCustomerBehavior(db.Model):
    __tablename__ = 'categorycustomerbehavior'

    category_id = Column('category_id', Integer, ForeignKey('categories.categoryid'), primary_key=True)
    hour_of_day = Column('hour_of_day', Integer, primary_key=True)
    busyness_multiplier = Column('busyness_multiplier')


class ZoneCounts(db.Model):
    __tablename__ = 'zone_counts'
    __table_args__ = {'extend_existing': True}

    zone_id = Column('zoneid', Integer, ForeignKey('zones.zoneid'), primary_key=True)
    total_length_m = Column('total_length_m', Float)
    area_m2 = Column('area_m2', Float)
    place_count = Column('place_count', Integer)


class ZoneBusynessPrediction(db.Model):
    __tablename__ = 'predicted_busyness2'

    zone_id = Column('zoneid', Integer, ForeignKey('zones.zoneid'), primary_key=True)
    hour_of_day = Column('cur_hour', Integer, primary_key=True)
    busyness = Column('predicted_busyness', Integer)


class StreetCounts(db.Model):
    __tablename__ = 'street_segment_counts'
    __table_args__ = {'extend_existing': True}

    zone_id = Column('zone_id', Integer, ForeignKey('zones.zoneid'), primary_key=True)
    street_id = Column('street_id', Integer, ForeignKey('fullstreets.street_id'))
    length_m = Column('length_m', Float)
    place_count = Column('places_count', Integer)


class CategoryBusynessCounts(db.Model):
    __tablename__ = 'category_busyness_counts'
    __table_args__ = {'extend_existing': True}

    hour = Column('hour_of_day', Integer, primary_key=True)
    zone_id = Column('zone_id', Integer, ForeignKey('zones.zoneid'), primary_key=True)
    street_id = Column('street_id', Integer, ForeignKey('fullstreets.street_id'), primary_key=True)
    total_category_busyness_by_street_and_hour = Column('street_segment_hourly_busyness', Integer)


class Busyness(db.Model):
    __tablename__ = 'busyness'

    busyness_id = Column('busynessid', Integer, primary_key=True)
    busyness_name = Column('busynesslevel', String)


class ZoneBusynessRange(db.Model):
    __tablename__ = 'zone_busyness_stats'

    id = Column('id', Integer, primary_key=True)
    q1 = Column('q1', Float)
    q2 = Column('q2', Float)
    q3 = Column('q3', Float)
    q4 = Column('q4', Float)


class StreetBusynessRange(db.Model):
    __tablename__ = 'street_busyness_stats'

    id = Column('id', Integer, primary_key=True)
    q1 = Column('q1', Float)
    q2 = Column('q2', Float)
    q3 = Column('q3', Float)
    q4 = Column('q4', Float)



class PlaceBusynessRange(db.Model):
    __tablename__ = 'place_busyness_stats'

    id = Column('id', Integer, primary_key=True)
    q1 = Column('q1', Float)
    q2 = Column('q2', Float)
    q3 = Column('q3', Float)
    q4 = Column('q4', Float)

