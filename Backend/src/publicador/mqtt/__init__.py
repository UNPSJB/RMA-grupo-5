from enum import StrEnum, auto

class TipoMensaje(StrEnum):
    STATUS = auto()
    TEMP_T = auto()  # Temperature
    TEMP2_T = auto()  # Temperature #2
    HUMIDITY_T = auto()  # Relative Humidity
    PRESSURE_T = auto()  # Atmospheric Pressure
    LIGHT_T = auto()  # Light (lux)
    SOIL_T = auto()  # Soil Moisture
    SOIL2_T = auto()  # Soil Moisture #2
    SOILR_T = auto()  # Soil Resistance
    SOILR2_T = auto()  # Soil Resistance #2
    OXYGEN_T = auto()  # Oxygen
    CO2_T = auto()  # Carbon Dioxide
    WINDSPD_T = auto()  # Wind Speed
    WINDHDG_T = auto()  # Wind Direction
    RAINFALL_T = auto()  # Rainfall
    MOTION_T = auto()  # Motion
    VOLTAGE_T = auto()  # Voltage
    VOLTAGE2_T = auto()  # Voltage #2
    CURRENT_T = auto()  # Current
    CURRENT2_T = auto()  # Current #2
    IT_T = auto()  # Iterations
    LATITUDE_T = auto()  # GPS Latitude
    LONGITUDE_T = auto()  # GPS Longitude
    ALTITUDE_T = auto()  # GPS Altitude
    HDOP_T = auto()  # GPS HDOP
