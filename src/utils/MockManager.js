/**
 * MockManager.js
 * Generates interface-level mock data for various controller profiles.
 */

export const MOCK_PROFILES = {
  XBOX: {
    id: 'xbox_360',
    deviceName: 'Xbox 360 Controller',
    pollingRate: 125,
    latency: 8.0,
    jitter: 0.5,
    stickResolution: 65535,
    triggerResolution: 255,
    hasXInput: true,
    hasHID: true,
    hasDInput: false,
  },
  DUALSENSE: {
    id: 'dual_sense',
    deviceName: 'DualSense Wireless Controller',
    pollingRate: 1000,
    latency: 1.0,
    jitter: 0.1,
    stickResolution: 65535, // 16-bit
    triggerResolution: 255, // 8-bit
    hasXInput: false,
    hasHID: true,
    hasDInput: true,
  },
  SWITCH_PRO: {
    id: 'switch_pro',
    deviceName: 'Pro Controller',
    pollingRate: 66,
    latency: 15.0,
    jitter: 1.2,
    stickResolution: 255, // Lower resolution for some switch clones/modes
    triggerResolution: 1,   // Digital triggers
    hasXInput: false,
    hasHID: true,
    hasDInput: true,
  }
};

export class MockManager {
  constructor() {
    this.activeProfileId = MOCK_PROFILES.XBOX.id;
    this.angle = 0;
    this.time = 0;
    this.running = false;
  }

  get currentProfile() {
    return Object.values(MOCK_PROFILES).find(p => p.id === this.activeProfileId) || MOCK_PROFILES.XBOX;
  }

  // Legacy compat
  setProfile(profileId) {
    this.setActiveDevice(profileId);
  }

  setActiveDevice(profileId) {
    const exists = Object.values(MOCK_PROFILES).some(p => p.id === profileId);
    if (exists) this.activeProfileId = profileId;
  }

  /** Returns a device_list message listing all mock profiles, with current selection. */
  getDeviceListMessage() {
    return {
      type: 'device_list',
      devices: Object.values(MOCK_PROFILES).map(p => ({ id: p.id, name: p.deviceName })),
      selectedId: this.activeProfileId,
    };
  }

  generateFrames() {
    // 生成动画帧数据
    this.angle += 0.05;
    this.time++;

    const messages = [];
    const profile = this.currentProfile;
    const numSamples = Math.ceil(profile.pollingRate / 60);
    const leftStick = [];
    const rightStick = [];

    for (let i = 0; i < numSamples; i++) {
        const subAngle = this.angle + (i * 0.01);

        let rx, ry, lx, ly;

        // 不同设备的摇杆运动轨迹不同
        if (profile.id === 'dual_sense') {
            const radius = 0.9 + Math.sin(this.time * 0.05) * 0.05;
            lx = Math.cos(subAngle) * radius;
            ly = Math.sin(subAngle) * radius;
            rx = Math.sin(subAngle * 0.5) * 0.8;
            ry = Math.cos(subAngle * 0.8) * 0.8;
        } else if (profile.id === 'switch_pro') {
            const radius = 0.8;
            lx = Math.cos(subAngle) * radius;
            ly = Math.sin(subAngle) * radius;
            // 量化到Switch Pro的分辨率
            lx = Math.round(lx * 127) / 127;
            ly = Math.round(ly * 127) / 127;
            rx = Math.sin(subAngle * 0.6) * 0.7;
            ry = Math.cos(subAngle * 0.9) * 0.7;
            rx = Math.round(rx * 127) / 127;
            ry = Math.round(ry * 127) / 127;
        } else {
            // Xbox默认配置
            const radius = 0.7 + Math.sin(this.time * 0.02) * 0.25;
            lx = Math.cos(subAngle) * radius;
            ly = Math.sin(subAngle) * radius;
            rx = Math.sin(subAngle * 0.7) * 0.5;
            ry = Math.sin(subAngle * 1.4) * 0.4;
        }

        // 添加抖动噪声
        const jitterVal = profile.jitter * 0.01;
        lx += (Math.random() - 0.5) * jitterVal;
        ly += (Math.random() - 0.5) * jitterVal;
        rx += (Math.random() - 0.5) * jitterVal;
        ry += (Math.random() - 0.5) * jitterVal;

        leftStick.push({ x: lx, y: ly, t: performance.now() + (i * (1000 / profile.pollingRate)) });
        rightStick.push({ x: rx, y: ry, t: performance.now() + (i * (1000 / profile.pollingRate)) });
    }

    // 扳机模拟
    const triggerL = profile.triggerResolution > 1
        ? Math.floor((Math.sin(this.time * 0.03) + 1) * (profile.triggerResolution / 2))
        : (Math.sin(this.time * 0.1) > 0 ? 255 : 0);

    const triggerR = profile.triggerResolution > 1
        ? Math.floor((Math.cos(this.time * 0.04) + 1) * (profile.triggerResolution / 2))
        : (Math.cos(this.time * 0.15) > 0 ? 255 : 0);

    // 按钮序列动画
    const buttonSequence = [0x1000, 0x2000, 0x4000, 0x8000, 0x0100, 0x0200, 0x0010, 0x0020, 0x0040, 0x0080, 0x0001, 0x0002, 0x0004, 0x0008];
    const buttonIndex = Math.floor(this.time / 30) % buttonSequence.length;
    const isPressed = (this.time % 30) < 15;
    const buttons = isPressed ? buttonSequence[buttonIndex] : 0;

    // 创建调试轴信息（模拟HID原始数据）
    const createDebugAxis = (p, u, val, bits = 16) => {
      const max = (1 << bits) - 1;
      const raw = Math.floor((val + 1) / 2 * max);
      return {
        page: p,
        usage: u,
        raw: raw,
        norm: val,
        min: 0,
        max: max,
        bits: bits
      };
    };

    const gamepadData = {
      type: 'gamepad_data',
      connected: true,
      deviceName: profile.deviceName,
      profileName: profile.deviceName,
      pollingRate: profile.pollingRate + (Math.random() - 0.5) * (profile.pollingRate * 0.02),
      latency: profile.latency + (Math.random() - 0.5) * profile.jitter,
      jitter: profile.jitter + (Math.random() - 0.5) * 0.05,
      buttons: buttons,
      triggerL: triggerL,
      triggerR: triggerR,
      hidActive: profile.hasHID,
      xinputActive: profile.hasXInput,
      dinputActive: profile.hasDInput,
      leftStick: leftStick,
      rightStick: rightStick,
      debugAxes: [
        createDebugAxis(0x01, 0x30, leftStick[numSamples-1].x), // X
        createDebugAxis(0x01, 0x31, leftStick[numSamples-1].y), // Y
        createDebugAxis(0x01, 0x32, rightStick[numSamples-1].x), // Z
        createDebugAxis(0x01, 0x35, rightStick[numSamples-1].y), // Rz
        createDebugAxis(0x01, 0x33, (triggerL / 127.5) - 1, 8),   // Rx
        createDebugAxis(0x01, 0x34, (triggerR / 127.5) - 1, 8)    // Ry
      ]
    };
    messages.push(gamepadData);

    // 模拟系统日志
    if (this.time % 300 === 1) {
       messages.push({
         type: 'log',
         level: 'info',
         message: `Mock: ${profile.deviceName} is performing optimally.`
       });
    }
    if (this.time % 1000 === 500) {
       messages.push({
         type: 'log',
         level: 'warn',
         message: `Mock: Simulated jitter spike detected (${(profile.jitter * 2).toFixed(2)}ms)`
       });
    }

    return messages;
  }
}
