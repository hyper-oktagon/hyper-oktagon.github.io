game.module('game.meteor')
.require('game.b2dvec')
.body(function() {
    game.addAsset('meteor.png');

    game.createClass('Meteor', {
        init: function(x, y, size, velocity) {
            this.sprite = new game.Sprite('meteor.png', x, y, {width: size, height: size, anchor: {x: 0.5, y: 0.5}});
            this.sprite.addTo(game.scene.stage);
            game.scene.addObject(this);

            var bodyDef = new game.Box2D.BodyDef();
            bodyDef.position = game.b2dvec(this.sprite.position.x, this.sprite.position.y);
            bodyDef.type = game.Box2D.Body.b2_dynamicBody;
            this.body = game.scene.Box2Dworld.CreateBody(bodyDef);

            var fixtureDef = new game.Box2D.FixtureDef;
            fixtureDef.shape = new game.Box2D.PolygonShape.AsBox(
                this.sprite.width / 2 * game.Box2D.SCALE,
                this.sprite.height / 2 * game.Box2D.SCALE
            );
            fixtureDef.density = size*800;
            fixtureDef.friction = 0.1;
            fixtureDef.restitution = 0.2;
            var meteor_fixture = this.body.CreateFixture(fixtureDef);
            meteor_fixture.SetUserData("meteor");
            this.body.SetLinearVelocity(game.b2dvec(velocity.x, velocity.y));

            this.emitter = new game.Emitter();
            this.emitter.textures.push('meteor.png');
            this.emitter.position = this.sprite.position;
            this.emitter.addTo(game.scene.stage);
            var scale = size/game.getTexture('meteor.png').width;
            this.emitter.startScale = 1/2 * scale;
            this.emitter.endScale = 0;
            this.emitter.positionVar.set(this.sprite.width / 4);
            this.emitter.count = 2;
            this.emitter.rate = 5;
            this.emitter.life = 250;
            this.emitter.liveVar = 100;
            game.scene.addEmitter(this.emitter);

            this.body.SetUserData(this);
            this.destroy = false;
            this.destroyTime = 5000;
        },

        update: function() {
            var p = this.body.GetPosition();
            this.sprite.position.x = p.x / game.Box2D.SCALE;
            this.sprite.position.y = p.y / game.Box2D.SCALE;
            this.sprite.rotation = this.body.GetAngle().round(2);

            if (this.destroy) {
                this.destroyTime -= 1000 * game.system.delta;
            }

            if (!game.onScreen(this.sprite.position) || this.destroy && this.destroyTime <= 0) {
                this.remove();
            }
        },

        remove: function() {
            game.scene.Box2Dworld.DestroyBody(this.body);
            this.sprite.remove();
            this.emitter.remove();
            game.scene.removeEmitter(this.emitter);
            game.scene.removeObject(this);
        }
    });
});