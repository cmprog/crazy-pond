export class HealthComponent
{
    constructor({
        lives = 3,
        invulnerableDuration = 2,
    } = {})
    {
        this.lives = lives;
        this.invulnerableDuration = invulnerableDuration;

        this.isInvulnerable = false;
        this.invulnerableTimer = null;
    }

    loseLife()
    {
        if (this.isInvulnerable)
            return;

        this.lives--;

        this.isInvulnerable = true;
        this.invulnerableTimer = new Timer(this.invulnerableDuration);
    }

    update()
    {
        if (!this.isInvulnerable)
            return;
        
        if (this.invulnerableTimer.elapsed())
        {
            this.isInvulnerable = false;
            this.invulnerableTimer = null;
        }
    }

    isDead()
    {
        return this.lives <= 0;
    }
}