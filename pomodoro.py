import tkinter as tk
from tkinter import messagebox

class PomodoroTimer:
    def __init__(self, root):
        self.root = root
        self.root.title("番茄钟 - 专注时光")
        self.root.geometry("300x400")
        self.root.resizable(False, False)

        # 窗口置顶，方便观察
        self.root.attributes("-topmost", True)

        # 时间配置 (秒)
        self.modes = {
            "专注": {"time": 25 * 60, "color": "#e74c3c"},
            "短休": {"time": 5 * 60, "color": "#2ecc71"},
            "长休": {"time": 15 * 60, "color": "#3498db"}
        }

        self.current_mode = "专注"
        self.remaining_time = self.modes[self.current_mode]["time"]
        self.is_running = False
        self.timer_id = None

        self.setup_ui()
        self.update_colors()

    def setup_ui(self):
        # 模式选择按钮组
        self.btn_frame = tk.Frame(self.root, bg=self.root.cget("bg"))
        self.btn_frame.pack(pady=20)

        self.mode_buttons = {}
        for mode in self.modes:
            btn = tk.Button(self.btn_frame, text=mode, command=lambda m=mode: self.set_mode(m),
                            font=("Microsoft YaHei", 10), width=6)
            btn.pack(side=tk.LEFT, padx=5)
            self.mode_buttons[mode] = btn

        # 计时显示
        self.label_time = tk.Label(self.root, text="25:00", font=("Helvetica", 60, "bold"),
                                   fg="white", bg=self.root.cget("bg"))
        self.label_time.pack(pady=40)

        # 控制按钮
        self.control_frame = tk.Frame(self.root, bg=self.root.cget("bg"))
        self.control_frame.pack(pady=20)

        self.start_button = tk.Button(self.control_frame, text="开始", command=self.toggle_timer,
                                     font=("Microsoft YaHei", 12), width=8, bg="#f1c40f")
        self.start_button.pack(side=tk.LEFT, padx=10)

        self.reset_button = tk.Button(self.control_frame, text="重置", command=self.reset_timer,
                                     font=("Microsoft YaHei", 12), width=8)
        self.reset_button.pack(side=tk.LEFT, padx=10)

    def set_mode(self, mode):
        self.stop_timer()
        self.current_mode = mode
        self.remaining_time = self.modes[mode]["time"]
        self.update_display()
        self.update_colors()

    def update_colors(self):
        color = self.modes[self.current_mode]["color"]
        self.root.configure(bg=color)
        self.label_time.configure(bg=color)
        self.btn_frame.configure(bg=color)
        self.control_frame.configure(bg=color)

    def update_display(self):
        mins, secs = divmod(self.remaining_time, 60)
        self.label_time.config(text=f"{mins:02d}:{secs:02d}")

    def toggle_timer(self):
        if self.is_running:
            self.stop_timer()
        else:
            self.start_timer()

    def start_timer(self):
        self.is_running = True
        self.start_button.config(text="暂停")
        self.tick()

    def stop_timer(self):
        self.is_running = False
        self.start_button.config(text="开始")
        if self.timer_id:
            self.root.after_cancel(self.timer_id)
            self.timer_id = None

    def reset_timer(self):
        self.stop_timer()
        self.remaining_time = self.modes[self.current_mode]["time"]
        self.update_display()

    def tick(self):
        if self.remaining_time > 0:
            self.remaining_time -= 1
            self.update_display()
            self.timer_id = self.root.after(1000, self.tick)
        else:
            self.is_running = False
            self.start_button.config(text="开始")
            messagebox.showinfo("时间到！", f"{self.current_mode}结束了，请休息/开始工作！")
            self.reset_timer()

if __name__ == "__main__":
    root = tk.Tk()
    app = PomodoroTimer(root)
    root.mainloop()
