from rest_framework import serializers
from .models import Element

class ElementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Element
        fields = "__all__"

'''
class MoleculeSerializer(serializers.ModelSerializer):
    atoms = AtomPositionSerializer(many=True, read_only=True)
    lonePairs = LonePairSerializer(source='lone_pairs', many=True, read_only=True)

    realAngle = serializers.SerializerMethodField()
    modelAngle = serializers.SerializerMethodField()

    class Meta:
        model = Molecule
        fields = [
            'formula', 'name', 'central_atom', 
            'atoms', 'lonePairs', 'realAngle', 'modelAngle'
        ]

    def get_realAngle(self, obj):
        return f"{obj.real_angle}°"

    def get_modelAngle(self, obj):
        return f"{obj.model_angle}°"


class AtomPositionSerializer(serializers.ModelSerializer):
    pos = serializers.SerializerMethodField()

    class Meta:
        model = AtomPosition
        fields = ['symbol', 'pos']

    def get_pos(self, obj):
        return {'x': obj.x, 'y': obj.y, 'z': obj.z}


class LonePairSerializer(serializers.ModelSerializer):
    class Meta:
        model = LonePair
        fields = ['x', 'y', 'z']
'''