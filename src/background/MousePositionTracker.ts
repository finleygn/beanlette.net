class MousePositionTracker {
  x = 0.5;
  y = 0.5;

  constructor() {
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('touchmove', this.handleTouch);
    window.addEventListener('touchstart', this.handleTouch);
  }

  handleMouseMove = (event: MouseEvent) => {
    this.x = event.clientX / window.innerWidth;
    this.y = event.clientY / window.innerHeight;
  }
  handleTouch = (event: TouchEvent) => {
    const touch = event.touches[0] || event.changedTouches[0];
    this.x = touch.clientX / window.innerWidth;
    this.y = touch.clientY / window.innerHeight;
  }

  getX = () => this.x;
  getY = () => 1 - this.y;
}

export default MousePositionTracker