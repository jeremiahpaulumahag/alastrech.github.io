// Character Renderer - Genshin Impact Chibi-Style Characters
export class CharacterRenderer {
    constructor(ctx, width, height) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.chibiScale = 180;
        this.headSize = 70;
        
        this.characters = [
            {
                name: 'Tine', position: 'left', lane: 1, x: width * 0.25,
                hairColor: '#8B6F47', hairHighlight: '#B4936A', hairStyle: 'updo',
                eyeColor: '#6B4423', eyeShape: 'gentle', skinTone: '#f5dcc4',
                blushColor: '#ffb3ba', topColor: '#f8f8ff', bottomColor: '#e8e8f0',
                accentColor: '#c9a0dc', personality: 'elegant', animation: 'graceful'
            },
            {
                name: 'Ala', position: 'center', lane: 2, x: width * 0.5,
                hairColor: '#6b4423', hairHighlight: '#8B6F47', hairStyle: 'shoulder-length-wavy',
                eyeColor: '#d4a574', eyeShape: 'bright', skinTone: '#f0d5b8',
                blushColor: '#ffb3c1', topColor: '#ffd700', bottomColor: '#4a5568',
                accentColor: '#ff69b4', personality: 'cheerful', animation: 'energetic',
                isMainCharacter: true
            },
            {
                name: 'Ruby', position: 'right', lane: 3, x: width * 0.75,
                hairColor: '#2b1810', hairHighlight: '#4a3528', hairStyle: 'long-ponytail',
                eyeColor: '#2b1810', eyeShape: 'sharp', skinTone: '#e8c4a0',
                blushColor: '#ffa07a', topColor: '#dc2626', bottomColor: '#1e293b',
                accentColor: '#f59e0b', personality: 'confident', animation: 'athletic'
            }
        ];
        
        this.blinkTimer = {};
        this.characters.forEach(char => { this.blinkTimer[char.name] = Math.random() * 3; });
    }
    
    render(exercise, animTime) {
        const isSeated = exercise.type === 'seated';
        this.characters.forEach(char => {
            if (isSeated) this.drawChair(char.x, this.height * 0.7);
            this.drawChibiCharacter(char, exercise, animTime, isSeated);
        });
    }
    
    drawChair(x, y) {
        const ctx = this.ctx;
        ctx.fillStyle = '#8b7355';
        ctx.fillRect(x - 50, y, 12, 80);
        ctx.fillRect(x + 38, y, 12, 80);
        ctx.fillRect(x - 50, y + 60, 12, 60);
        ctx.fillRect(x + 38, y + 60, 12, 60);
        ctx.fillStyle = '#a0826d';
        ctx.fillRect(x - 60, y - 10, 120, 15);
        ctx.fillRect(x - 60, y - 100, 15, 100);
        ctx.fillRect(x - 60, y - 100, 120, 15);
    }
    
    drawChibiCharacter(char, exercise, animTime, isSeated) {
        const ctx = this.ctx;
        const baseY = isSeated ? this.height * 0.7 - 30 : this.height * 0.75;
        const phase = (animTime * 2) % (Math.PI * 2);
        const anim = this.getAnimationOffsets(exercise.name, phase, char.animation);
        const bounceAmount = char.isMainCharacter ? 8 : 5;
        const bounce = Math.sin(animTime * 3) * bounceAmount;
        const bodyX = char.x;
        const bodyY = baseY + bounce;
        
        ctx.save();
        ctx.translate(bodyX, bodyY);
        this.drawChibiHair(char, anim);
        this.drawChibiBody(char, anim, isSeated);
        this.drawChibiHead(char, anim, animTime);
        this.drawChibiAccessories(char);
        ctx.restore();
    }
    
    drawChibiBody(char, anim, isSeated) {
        const ctx = this.ctx;
        const bodyWidth = 45;
        const bodyHeight = 55;
        
        ctx.save();
        ctx.rotate(anim.torsoRotation || 0);
        
        ctx.fillStyle = char.topColor;
        this.drawRoundRect(ctx, -bodyWidth/2, 0, bodyWidth, bodyHeight, 15);
        
        ctx.fillStyle = this.darkenColor(char.topColor, 20);
        ctx.globalAlpha = 0.3;
        this.drawRoundRect(ctx, -bodyWidth/2, bodyHeight - 15, bodyWidth, 15, 8);
        ctx.globalAlpha = 1.0;
        
        if (char.accentColor) {
            ctx.fillStyle = char.accentColor;
            ctx.beginPath();
            ctx.arc(0, bodyHeight * 0.3, 8, 0, Math.PI * 2);
            ctx.fill();
        }
        
        this.drawChibiArm(char, anim.leftArmAngle || 0, -bodyWidth/2 - 5, 10, 'left');
        this.drawChibiArm(char, anim.rightArmAngle || 0, bodyWidth/2 + 5, 10, 'right');
        
        if (!isSeated) {
            this.drawChibiLeg(char, anim.leftLegAngle || 0, -15, bodyHeight);
            this.drawChibiLeg(char, anim.rightLegAngle || 0, 15, bodyHeight);
        }
        
        ctx.restore();
    }
    
    drawChibiArm(char, angle, x, y, side) {
        const ctx = this.ctx;
        const armLength = 35;
        const armWidth = 12;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        
        ctx.fillStyle = char.topColor;
        ctx.beginPath();
        ctx.ellipse(0, armLength/2, armWidth/2, armLength/2, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = char.skinTone;
        ctx.beginPath();
        ctx.arc(0, armLength, armWidth/2 + 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    drawChibiLeg(char, angle, x, y) {
        const ctx = this.ctx;
        const legLength = 40;
        const legWidth = 14;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        
        ctx.fillStyle = char.bottomColor;
        ctx.fillRect(-legWidth/2, 0, legWidth, legLength);
        
        ctx.fillStyle = this.darkenColor(char.bottomColor, 15);
        ctx.beginPath();
        ctx.ellipse(0, legLength + 5, 10, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    drawChibiHead(char, anim, animTime) {
        const ctx = this.ctx;
        const headSize = this.headSize;
        
        ctx.save();
        ctx.translate(0, -headSize/2);
        ctx.rotate(anim.headRotation || 0);
        
        ctx.fillStyle = char.skinTone;
        ctx.beginPath();
        ctx.ellipse(0, 0, headSize/2, headSize/1.8, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = this.darkenColor(char.skinTone, 10);
        ctx.globalAlpha = 0.15;
        ctx.beginPath();
        ctx.ellipse(0, headSize/4, headSize/2.5, headSize/4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
        
        this.drawAnimeEyes(char, animTime);
        this.drawAnimeNose(char);
        this.drawAnimeMouth(char, anim);
        this.drawBlush(char);
        
        ctx.restore();
    }
    
    drawAnimeEyes(char, animTime) {
        const ctx = this.ctx;
        const eyeSpacing = 18;
        const eyeY = -5;
        
        this.blinkTimer[char.name] += 0.016;
        const shouldBlink = (this.blinkTimer[char.name] % 3) < 0.15;
        
        if (shouldBlink) {
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(-eyeSpacing - 8, eyeY);
            ctx.lineTo(-eyeSpacing + 8, eyeY);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(eyeSpacing - 8, eyeY);
            ctx.lineTo(eyeSpacing + 8, eyeY);
            ctx.stroke();
        } else {
            [-eyeSpacing, eyeSpacing].forEach(x => {
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                
                if (char.eyeShape === 'gentle') {
                    ctx.ellipse(x, eyeY, 10, 12, 0, 0, Math.PI * 2);
                } else if (char.eyeShape === 'bright') {
                    ctx.ellipse(x, eyeY, 11, 14, 0, 0, Math.PI * 2);
                } else {
                    ctx.ellipse(x, eyeY, 10, 13, 0, 0, Math.PI * 2);
                }
                ctx.fill();
                
                ctx.fillStyle = char.eyeColor;
                ctx.beginPath();
                ctx.arc(x, eyeY + 2, 8, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.fillStyle = '#000';
                ctx.beginPath();
                ctx.arc(x, eyeY + 2, 4, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(x - 2, eyeY, 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(x + 3, eyeY + 4, 1.5, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 2;
                ctx.beginPath();
                
                if (char.eyeShape === 'gentle') {
                    ctx.ellipse(x, eyeY, 10, 12, 0, 0, Math.PI * 2);
                } else if (char.eyeShape === 'bright') {
                    ctx.ellipse(x, eyeY, 11, 14, 0, 0, Math.PI * 2);
                } else {
                    ctx.ellipse(x, eyeY, 10, 13, 0, 0, Math.PI * 2);
                }
                ctx.stroke();
                
                ctx.lineWidth = 2;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(x - 10, eyeY - 10);
                ctx.lineTo(x - 12, eyeY - 13);
                ctx.moveTo(x + 10, eyeY - 10);
                ctx.lineTo(x + 12, eyeY - 13);
                ctx.stroke();
            });
        }
    }
    
    drawAnimeNose(char) {
        const ctx = this.ctx;
        ctx.fillStyle = this.darkenColor(char.skinTone, 15);
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.arc(0, 8, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
    }
    
    drawAnimeMouth(char, anim) {
        const ctx = this.ctx;
        const mouthY = 18;
        
        ctx.strokeStyle = this.darkenColor(char.skinTone, 40);
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        if (char.personality === 'cheerful') {
            ctx.arc(0, mouthY - 5, 8, 0.2, Math.PI - 0.2);
        } else if (char.personality === 'elegant') {
            ctx.arc(0, mouthY - 3, 6, 0.3, Math.PI - 0.3);
        } else {
            ctx.arc(0, mouthY - 4, 7, 0.2, Math.PI - 0.2);
        }
        ctx.stroke();
    }
    
    drawBlush(char) {
        const ctx = this.ctx;
        ctx.fillStyle = char.blushColor;
        ctx.globalAlpha = 0.4;
        
        ctx.beginPath();
        ctx.ellipse(-25, 5, 8, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.ellipse(25, 5, 8, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.globalAlpha = 1.0;
    }
    
    drawChibiHair(char, anim) {
        const ctx = this.ctx;
        const headSize = this.headSize;
        
        ctx.save();
        ctx.translate(0, -headSize/2);
        
        const hairSway = Math.sin((anim.headRotation || 0) * 2) * 3;
        
        switch (char.hairStyle) {
            case 'updo':
                this.drawUpdoHair(char, hairSway);
                break;
            case 'shoulder-length-wavy':
                this.drawWavyHair(char, hairSway);
                break;
            case 'long-ponytail':
                this.drawPonytailHair(char, hairSway);
                break;
        }
        
        ctx.restore();
    }


    drawUpdoHair(char, sway) {
        const ctx = this.ctx;

        ctx.fillStyle = char.hairColor;
        ctx.beginPath();
        ctx.ellipse(0, -25, 25, 20, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = char.hairHighlight;
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.ellipse(-5, -28, 12, 8, -0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;

        ctx.fillStyle = char.hairColor;
        ctx.beginPath();
        ctx.moveTo(-35, -15);
        ctx.quadraticCurveTo(-30, -35, -15, -35);
        ctx.quadraticCurveTo(-5, -40, 0, -38);
        ctx.quadraticCurveTo(5, -40, 15, -35);
        ctx.quadraticCurveTo(30, -35, 35, -15);
        ctx.lineTo(35, -10);
        ctx.quadraticCurveTo(25, -5, 15, 0);
        ctx.lineTo(-15, 0);
        ctx.quadraticCurveTo(-25, -5, -35, -10);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(-30 + sway, 10);
        ctx.quadraticCurveTo(-32 + sway, 25, -28 + sway, 35);
        ctx.lineTo(-25 + sway, 35);
        ctx.quadraticCurveTo(-29 + sway, 25, -27 + sway, 10);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(30 - sway, 10);
        ctx.quadraticCurveTo(32 - sway, 25, 28 - sway, 35);
        ctx.lineTo(25 - sway, 35);
        ctx.quadraticCurveTo(29 - sway, 25, 27 - sway, 10);
        ctx.fill();
    }

    drawWavyHair(char, sway) {
        const ctx = this.ctx;

        ctx.fillStyle = char.hairColor;
        ctx.beginPath();
        ctx.ellipse(0, -20, 38, 35, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(-35, -10);
        ctx.quadraticCurveTo(-40 + sway, 10, -38 + sway, 30);
        ctx.quadraticCurveTo(-36 + sway, 45, -30 + sway, 50);
        ctx.lineTo(-25 + sway, 48);
        ctx.quadraticCurveTo(-30 + sway, 40, -32 + sway, 25);
        ctx.quadraticCurveTo(-33 + sway, 10, -30, -10);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(35, -10);
        ctx.quadraticCurveTo(40 - sway, 10, 38 - sway, 30);
        ctx.quadraticCurveTo(36 - sway, 45, 30 - sway, 50);
        ctx.lineTo(25 - sway, 48);
        ctx.quadraticCurveTo(30 - sway, 40, 32 - sway, 25);
        ctx.quadraticCurveTo(33 - sway, 10, 30, -10);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(-35, -12);
        ctx.quadraticCurveTo(-25, -38, -10, -36);
        ctx.quadraticCurveTo(0, -40, 10, -38);
        ctx.quadraticCurveTo(25, -38, 35, -12);
        ctx.lineTo(30, -8);
        ctx.quadraticCurveTo(15, -5, 0, -5);
        ctx.quadraticCurveTo(-15, -5, -30, -8);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = char.hairHighlight;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.ellipse(-10, -25, 15, 20, -0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(8, -22, 12, 18, 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
    }




    drawPonytailHair(char, sway) {
        const ctx = this.ctx;

        ctx.fillStyle = char.hairColor;
        ctx.beginPath();
        ctx.moveTo(-8, -20);
        ctx.quadraticCurveTo(-10 + sway * 2, 10, -12 + sway * 3, 50);
        ctx.quadraticCurveTo(-10 + sway * 3, 80, -5 + sway * 4, 100);
        ctx.lineTo(5 + sway * 4, 100);
        ctx.quadraticCurveTo(10 + sway * 3, 80, 12 + sway * 3, 50);
        ctx.quadraticCurveTo(10 + sway * 2, 10, 8, -20);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = char.hairHighlight;
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.moveTo(-2, 0);
        ctx.quadraticCurveTo(-4 + sway * 2, 30, -5 + sway * 3, 70);
        ctx.lineTo(0 + sway * 3, 70);
        ctx.quadraticCurveTo(0 + sway * 2, 30, 0, 0);
        ctx.fill();
        ctx.globalAlpha = 1.0;

        ctx.fillStyle = char.accentColor;
        ctx.fillRect(-10, -15, 20, 8);

        ctx.fillStyle = char.hairColor;
        ctx.beginPath();
        ctx.moveTo(-35, -10);
        ctx.quadraticCurveTo(-30, -35, -12, -35);
        ctx.quadraticCurveTo(0, -38, 12, -35);
        ctx.quadraticCurveTo(30, -35, 35, -10);
        ctx.lineTo(30, -5);
        ctx.quadraticCurveTo(15, 5, 0, 5);
        ctx.quadraticCurveTo(-15, 5, -30, -5);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(-32, 0);
        ctx.quadraticCurveTo(-35 + sway, 15, -33 + sway, 25);
        ctx.lineTo(-30 + sway, 24);
        ctx.quadraticCurveTo(-32 + sway, 14, -29, 0);
        ctx.fill();
    }

    drawChibiAccessories(char) {
        const ctx = this.ctx;

        if (char.name === 'Ala' && char.isMainCharacter) {
            ctx.save();
            ctx.translate(0, -this.headSize);
            ctx.fillStyle = '#FFD700';
            ctx.globalAlpha = 0.65;

            [[-40, -10], [40, -5], [-35, 15], [38, 12]].forEach(([x, y]) => {
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x + 3, y + 3);
                ctx.lineTo(x, y + 6);
                ctx.lineTo(x - 3, y + 3);
                ctx.closePath();
                ctx.fill();
            });

            ctx.restore();
        }
    }

    drawRoundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();
    }



    getAnimationOffsets(exerciseName, phase, animationType = 'graceful') {
        const sin = Math.sin(phase);
        const cos = Math.cos(phase);
        const energyMultiplier = animationType === 'energetic' ? 1.3 : animationType === 'athletic' ? 1.2 : 1.0;

        switch (exerciseName) {
            case 'Seated Neck Rolls':
                return {
                    headRotation: sin * 0.3,
                    leftArmAngle: 0.1,
                    rightArmAngle: -0.1,
                    torsoRotation: 0
                };

            case 'Seated Shoulder Shrugs':
                return {
                    headRotation: 0,
                    leftArmAngle: -0.2 + sin * 0.3 * energyMultiplier,
                    rightArmAngle: 0.2 + sin * 0.3 * energyMultiplier,
                    torsoRotation: sin * 0.05
                };

            case 'Standing Side Bends':
                return {
                    headRotation: sin * 0.2,
                    leftArmAngle: -Math.PI / 2 + sin * 0.4 * energyMultiplier,
                    rightArmAngle: -Math.PI / 2 - sin * 0.4 * energyMultiplier,
                    torsoRotation: sin * 0.3 * energyMultiplier,
                    leftLegAngle: 0,
                    rightLegAngle: 0
                };

            case 'Seated Torso Twists':
                return {
                    headRotation: sin * 0.3,
                    leftArmAngle: -Math.PI / 3 + sin * 0.3,
                    rightArmAngle: Math.PI / 3 - sin * 0.3,
                    torsoRotation: sin * 0.4 * energyMultiplier
                };

            case 'Standing Arm Circles':
                return {
                    headRotation: 0,
                    leftArmAngle: -Math.PI / 2 + phase * energyMultiplier,
                    rightArmAngle: -Math.PI / 2 + phase + Math.PI,
                    torsoRotation: 0,
                    leftLegAngle: sin * 0.05,
                    rightLegAngle: -sin * 0.05
                };

            case 'Seated Wrist Rotations':
                return {
                    headRotation: 0,
                    leftArmAngle: Math.PI / 4 + sin * 0.1,
                    rightArmAngle: -Math.PI / 4 - sin * 0.1,
                    torsoRotation: 0
                };

            case 'Standing Hip Circles':
                return {
                    headRotation: sin * 0.1,
                    leftArmAngle: -0.3,
                    rightArmAngle: 0.3,
                    torsoRotation: cos * 0.2 * energyMultiplier,
                    leftLegAngle: sin * 0.1,
                    rightLegAngle: -sin * 0.1
                };

            case 'Seated Ankle Rolls':
                return {
                    headRotation: 0,
                    leftArmAngle: 0.2,
                    rightArmAngle: -0.2,
                    torsoRotation: 0
                };

            default:
                return {
                    headRotation: 0,
                    leftArmAngle: 0,
                    rightArmAngle: 0,
                    torsoRotation: 0,
                    leftLegAngle: 0,
                    rightLegAngle: 0
                };
        }
    }

    darkenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const r = Math.max(0, Math.min(255, (num >> 16) - amt));
        const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) - amt));
        const b = Math.max(0, Math.min(255, (num & 0x0000FF) - amt));
        return '#' + (0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1);
    }
}
