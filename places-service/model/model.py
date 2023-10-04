from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, DateTime, func, Float, Time
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import relationship
from geoalchemy2 import Geometry
from config.db import db


class Place(db.Model):
    __tablename__ = 'places'

    place_id = Column(String, primary_key=True)
    place_name = Column(String)
    _address = Column('address', String)
    category_id = Column(db.Integer, ForeignKey('categories.categoryid'))
    location = Column(Geometry('POINT'))
    street_id = Column(Integer, ForeignKey('fullstreets.street_id'))
    zone_id = Column(Integer, ForeignKey('zones.zoneid'))
    image = Column(String)
    outdoor_seating = Column(Boolean)

    opening_hours = relationship('OpeningHours', backref='hours', lazy='joined', uselist=False)
    ratings = relationship('Rating', backref='places', lazy='joined')

    @hybrid_property
    def address(self):
        return self._address.replace('[', '').replace(']', '').replace("'", "").replace(", ", ",")

    category = relationship('Category', backref='places', lazy='joined')
    average_rating = relationship('PlaceRating', uselist=False, viewonly=True)


class Rating(db.Model):
    __tablename__ = 'ratings'

    place_id = Column(String, ForeignKey('places.place_id'), primary_key=True)
    user_id = Column(Integer, ForeignKey('users.userid'), primary_key=True)
    rating_value = Column(Integer)
    date_created = Column(DateTime, default=func.now())
    date_updated = Column(DateTime, default=func.now(), onupdate=func.now())

    def __init__(self, place_id, user_id, rating_value):
        self.place_id = place_id
        self.user_id = user_id
        self.rating_value = rating_value


class Category(db.Model):
    __tablename__ = 'categories'

    id = Column('categoryid', db.Integer, primary_key=True)
    name = Column('categoryname', db.String)


class PlaceRating(db.Model):
    __tablename__ = 'place_average_ratings'
    __table_args__ = {'extend_existing': True}

    place_id = Column('place_id', String, ForeignKey('places.place_id'), primary_key=True)
    average_rating = Column('average_rating', Float)


class User(db.Model):
    __tablename__ = 'users'

    user_id = Column('userid', db.Integer, primary_key=True)
    user_email_address = Column('emailaddress', db.String)


class OpeningHours(db.Model):
    __tablename__ = 'places_hours'

    place_id = Column(String, ForeignKey('places.place_id'), primary_key=True)
    monday_open = Column('mon_opening_time', Time)
    monday_close = Column('mon_closing_time', Time)
    tuesday_open = Column('tues_opening_time', Time)
    tuesday_close = Column('tues_closing_time', Time)
    wednesday_open = Column('wed_opening_time', Time)
    wednesday_close = Column('wed_closing_time', Time)
    thursday_open = Column('thurs_opening_time', Time)
    thursday_close = Column('thurs_closing_time', Time)
    friday_open = Column('fri_opening_time', Time)
    friday_close = Column('fri_closing_time', Time)
    saturday_open = Column('sat_opening_time', Time)
    saturday_close = Column('sat_closing_time', Time)
    sunday_open = Column('sun_opening_time', Time)
    sunday_close = Column('sun_closing_time', Time)
