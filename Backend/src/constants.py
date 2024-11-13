class ErrorCode:
    NODO_NO_ENCONTRADO = "El nodo no fue encontrado."

# Lista de tipos de datos iniciales
TIPOS_DE_DATOS_INICIALES = [
    {"nombre": "TEMP_T", "unidad": "°C", "rango_minimo": -50, "rango_maximo": 50},           # Temperature
    {"nombre": "TEMP2_T", "unidad": "°C", "rango_minimo": -50, "rango_maximo": 50},          # Temperature #2
    {"nombre": "HUMIDITY_T", "unidad": "%", "rango_minimo": 0, "rango_maximo": 100},         # Relative Humidity
    {"nombre": "PRESSURE_T", "unidad": "hPa", "rango_minimo": 300, "rango_maximo": 1100},    # Atmospheric Pressure
    {"nombre": "LIGHT_T", "unidad": "lux", "rango_minimo": 0, "rango_maximo": 100000},       # Light (lux)
    {"nombre": "SOIL_T", "unidad": "%", "rango_minimo": 0, "rango_maximo": 100},             # Soil Moisture
    {"nombre": "SOIL2_T", "unidad": "%", "rango_minimo": 0, "rango_maximo": 100},            # Soil Moisture #2
    {"nombre": "SOILR_T", "unidad": "ohm", "rango_minimo": 0, "rango_maximo": 10000},        # Soil Resistance
    {"nombre": "SOILR2_T", "unidad": "ohm", "rango_minimo": 0, "rango_maximo": 10000},       # Soil Resistance #2
    {"nombre": "OXYGEN_T", "unidad": "%", "rango_minimo": 0, "rango_maximo": 100},           # Oxygen
    {"nombre": "CO2_T", "unidad": "ppm", "rango_minimo": 0, "rango_maximo": 5000},           # Carbon Dioxide
    {"nombre": "WINDSPD_T", "unidad": "m/s", "rango_minimo": 0, "rango_maximo": 60},         # Wind Speed
    {"nombre": "WINDHDG_T", "unidad": "°", "rango_minimo": 0, "rango_maximo": 360},          # Wind Direction
    {"nombre": "RAINFALL_T", "unidad": "mm", "rango_minimo": 0, "rango_maximo": 500},        # Rainfall
    {"nombre": "MOTION_T", "unidad": "boolean", "rango_minimo": 0, "rango_maximo": 1},       # Motion
    {"nombre": "VOLTAGE_T", "unidad": "V", "rango_minimo": 0, "rango_maximo": 240},          # Voltage
    {"nombre": "VOLTAGE2_T", "unidad": "V", "rango_minimo": 0, "rango_maximo": 240},         # Voltage #2
    {"nombre": "CURRENT_T", "unidad": "A", "rango_minimo": 0, "rango_maximo": 100},          # Current
    {"nombre": "CURRENT2_T", "unidad": "A", "rango_minimo": 0, "rango_maximo": 100},         # Current #2
    {"nombre": "IT_T", "unidad": "int", "rango_minimo": 0, "rango_maximo": 10000},           # Iterations
    {"nombre": "LATITUDE_T", "unidad": "°", "rango_minimo": -90, "rango_maximo": 90},        # GPS Latitude
    {"nombre": "LONGITUDE_T", "unidad": "°", "rango_minimo": -180, "rango_maximo": 180},     # GPS Longitude
    {"nombre": "ALTITUDE_T", "unidad": "m", "rango_minimo": -500, "rango_maximo": 10000},    # GPS Altitude
    {"nombre": "HDOP_T", "unidad": "", "rango_minimo": 0, "rango_maximo": 50},               # GPS HDOP
    {"nombre": "LEVEL_T", "unidad": "%", "rango_minimo": 0, "rango_maximo": 100},            # Level
    {"nombre": "UV_T", "unidad": "index", "rango_minimo": 0, "rango_maximo": 15},            # UV
    {"nombre": "PM1_T", "unidad": "µg/m³", "rango_minimo": 0, "rango_maximo": 500},          # PM1
    {"nombre": "PM2_5_T", "unidad": "µg/m³", "rango_minimo": 0, "rango_maximo": 500},        # PM2.5
    {"nombre": "PM10_T", "unidad": "µg/m³", "rango_minimo": 0, "rango_maximo": 500},         # PM10
    {"nombre": "POWER_T", "unidad": "W", "rango_minimo": 0, "rango_maximo": 10000},          # Power
    {"nombre": "POWER2_T", "unidad": "W", "rango_minimo": 0, "rango_maximo": 10000},         # Power #2
    {"nombre": "ENERGY_T", "unidad": "kWh", "rango_minimo": 0, "rango_maximo": 10000},       # Energy
    {"nombre": "ENERGY2_T", "unidad": "kWh", "rango_minimo": 0, "rango_maximo": 10000},      # Energy #2
    {"nombre": "WEIGHT_T", "unidad": "kg", "rango_minimo": 0, "rango_maximo": 1000},         # Weight
    {"nombre": "WEIGHT2_T", "unidad": "kg", "rango_minimo": 0, "rango_maximo": 1000},         # Weight #2
    {"nombre": "DESCONOCIDO", "unidad": "Indeterminado", "rango_minimo": None , "rango_maximo": None }       # Nro 36 en la BD
]