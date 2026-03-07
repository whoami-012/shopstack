from enum import Enum

class ProductCategory(str, Enum):
    Electronics = "Electronics"
    Clothing =  "Clothing"
    Home_Garden = "Home & Garden"
    Beauty_Health = "Beauty & Health"
    General = "General"