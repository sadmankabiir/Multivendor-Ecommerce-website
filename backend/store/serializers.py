from rest_framework import serializers
from vendor.models import Vendor
from userauths.serializer import ProfileSerializer



from store.models import (
    Product,
    Category,
    Gallery,
    Specification,
    Size,
    Color,
    Cart,
    CartOrder,
    CartOrderItem,
    ProductFaq,
    Review,
    Coupon,
    Notification,
    Wishlist,
)


class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = "__all__"


class GallerySerializer(serializers.ModelSerializer):

    class Meta:
        model = Gallery
        fields = "__all__"


class SpecificationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Specification
        fields = "__all__"


class SizeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Size
        fields = "__all__"


class ColorSerializer(serializers.ModelSerializer):

    class Meta:
        model = Color
        fields = "__all__"

# Vendor app's Vendor model
class VendorSerializer(serializers.ModelSerializer):

    class Meta:
        model = Vendor
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(VendorSerializer, self).__init__(*args, **kwargs)
        request = self.context.get('request')
        if request and request.method == 'POST':
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3


class ProductSerializer(serializers.ModelSerializer):
    gallery = GallerySerializer(many=True, read_only=True)
    color = ColorSerializer(many=True, read_only=True)
    size = SizeSerializer(many=True, read_only=True)
    specification = SpecificationSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "title",
            "image",
            "description",
            "category",
            "price",
            "old_price",
            "shipping_amount",
            "stock_qty",
            "in_stock",
            "status",
            "featured",
            "views",
            # "rating",
            "vendor",
            "pid",
            "slug",
            "date",
            "gallery",
            "specification",
            "size",
            "color",
            "product_rating",
            "rating_count",
            "orders",
        ]
    
    def __init__(self, *args, **kwargs):
        super(ProductSerializer, self).__init__(*args, **kwargs)
        request = self.context.get('request')
        if request and request.method == 'POST':
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3

class ProductWriteSerializer(serializers.ModelSerializer):
    specifications = SpecificationSerializer(many=True, write_only=True, required=False)
    colors = ColorSerializer(many=True, write_only=True, required=False)
    sizes = SizeSerializer(many=True, write_only=True, required=False)
    gallery = GallerySerializer(many=True, write_only=True, required=False)

    class Meta:
        model = Product
        fields = [
            'id', 'title', 'image', 'description', 'category', 'price',
            'old_price', 'shipping_amount', 'stock_qty', 'vendor',
            'specifications', 'colors', 'sizes', 'gallery'
        ]
        depth = 3

    def create(self, validated_data):
        specifications_data = validated_data.pop('specifications', [])
        colors_data = validated_data.pop('colors', [])
        sizes_data = validated_data.pop('sizes', [])
        gallery_data = validated_data.pop('gallery', [])

        product = Product.objects.create(**validated_data)

        for spec_data in specifications_data:
            Specification.objects.create(product=product, **spec_data)
        for color_data in colors_data:
            Color.objects.create(product=product, **color_data)
        for size_data in sizes_data:
            Size.objects.create(product=product, **size_data)
        for gallery_item in gallery_data:
            Gallery.objects.create(product=product, **gallery_item)

        return product

    def update(self, instance, validated_data):
        specifications_data = validated_data.pop('specifications', [])
        colors_data = validated_data.pop('colors', [])
        sizes_data = validated_data.pop('sizes', [])
        gallery_data = validated_data.pop('gallery', [])

        instance = super().update(instance, validated_data)

        instance.specification_set.all().delete()
        instance.color_set.all().delete()
        instance.size_set.all().delete()
        instance.gallery_set.all().delete()

        for spec_data in specifications_data:
            Specification.objects.create(product=instance, **spec_data)
        for color_data in colors_data:
            Color.objects.create(product=instance, **color_data)
        for size_data in sizes_data:
            Size.objects.create(product=instance, **size_data)
        for gallery_item in gallery_data:
            Gallery.objects.create(product=instance, **gallery_item)

        return instance


class CartSerializer(serializers.ModelSerializer):
    # product = ProductSerializer()
    class Meta:
        model = Cart
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super(CartSerializer, self).__init__(*args, **kwargs)
        request = self.context.get("request")
        if request and request.method == "POST":
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3


class CartOrderItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = CartOrderItem
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super(CartOrderItemSerializer, self).__init__(*args, **kwargs)
        request = self.context.get("request")
        if request and request.method == "POST":
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3


class CartOrderSerializer(serializers.ModelSerializer):
    orderitem = CartOrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = CartOrder
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super(CartOrderSerializer, self).__init__(*args, **kwargs)
        request = self.context.get("request")
        if request and request.method == "POST":
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3


class ProductFaqSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProductFaq
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super(ProductFaqSerializer, self).__init__(*args, **kwargs)
        request = self.context.get("request")
        if request and request.method == "POST":
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3


class ReviewSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()
    
    class Meta:
        model = Review
        fields = ["id", "review", "rating", "reply", "user", "product", "profile", "date"]

    def __init__(self, *args, **kwargs):
        super(ReviewSerializer, self).__init__(*args, **kwargs)
        request = self.context.get('request')
        if request and request.method == 'POST':
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3


class WishlistSerializer(serializers.ModelSerializer):

    class Meta:
        model = Wishlist
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super(WishlistSerializer, self).__init__(*args, **kwargs)
        request = self.context.get("request")
        if request and request.method == "POST":
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3


class CouponSerializer(serializers.ModelSerializer):

    class Meta:
        model = Coupon
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super(CouponSerializer, self).__init__(*args, **kwargs)
        request = self.context.get("request")
        if request and request.method == "POST":
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3


class NotificationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Notification
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super(NotificationSerializer, self).__init__(*args, **kwargs)
        request = self.context.get("request")
        if request and request.method == "POST":
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3





class SummarySerializer(serializers.Serializer):
    products = serializers.IntegerField()
    orders = serializers.IntegerField()
    revenue = serializers.DecimalField(max_digits=12, decimal_places=2)

class EarningSerializer(serializers.Serializer):
   monthly_revenue = serializers.DecimalField(max_digits=12, decimal_places=2)
   total_revenue = serializers.DecimalField(max_digits=12, decimal_places=2)

class CouponSummarySerializer(serializers.Serializer):
    total_coupons = serializers.IntegerField()
    active_coupons = serializers.IntegerField()

class NotificationSummarySerializer(serializers.Serializer):
    un_read_noti = serializers.IntegerField()
    read_noti = serializers.IntegerField()
    all_noti = serializers.IntegerField()