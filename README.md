# 🌊 FloodRadar — Urban Flood Modeling Using Calculus I and Numerical Integration

**FloodRadar** is an interactive web application developed with **Next.js**, **shadcn/ui**, and **Recharts** to simulate urban flooding scenarios through the application of fundamental concepts from **Calculus I**, including:

* Derivatives
* Numerical integration
* Limits
* Functions
* Finite differences

The project demonstrates how mathematical modeling can be applied to represent water accumulation dynamics and flood-risk conditions caused by intense rainfall and drainage limitations.

Designed for:

* Academic presentations
* Applied mathematics demonstrations
* Hydrological modeling studies
* Computational simulation projects

---

# 🚀 Features

## 🔢 Real-Time Mathematical Simulation

Using three primary parameters:

* **R(t)** → rainfall intensity
* **D(t)** → drainage capacity
* **t** → event duration

the system computes:

* **A(t)** → accumulated water volume
* **A′(t)** → accumulation rate of change
* **Risk(t)** → hydrological risk indicator

All values are updated dynamically through interactive visualizations.

---

# 📊 Interactive Academic Dashboard

The dashboard includes:

* Real-time KPIs
* Flood accumulation monitoring
* Derivative analysis
* Risk estimation
* Comparative rainfall × drainage analysis
* Radar-based risk visualization

### Included Charts

| Chart                | Purpose                 |
| -------------------- | ----------------------- |
| AreaChart            | Water accumulation A(t) |
| LineChart            | Derivative A′(t)        |
| Multi-LineChart      | Rainfall vs Drainage    |
| RadialBarChart       | Flood-risk indicator    |
| Historical LineChart | Risk evolution          |

All charts are responsive and optimized for scientific presentation.

---

# 🔬 Mathematical Modeling

## 1) Water Accumulation Model

The accumulation function is defined as:

A(t+\Delta t)=A(t)+(I-D)\Delta t

Assuming:

\Delta t=1

the discrete model becomes:

A(t+1)=A(t)+(I-D)

This equation represents how water accumulates over time depending on the relationship between rainfall intensity and drainage capacity.

---

## 2) Derivative — Rate of Change

The instantaneous accumulation variation is modeled by:

A'(t)=I(t)-D(t)

Interpretation:

* **A′(t) > 0** → accumulation increases
* **A′(t) = 0** → equilibrium state
* **A′(t) < 0** → drainage exceeds rainfall input

---

## 3) Hydrological Risk Function

Flood risk is estimated through:

Risk(t)=\min(100,2.4\cdot A(t))

This simplified metric provides an intuitive representation of flood severity.

---

# 📘 Educational Purpose

FloodRadar was designed to connect:

* Mathematical modeling
* Hydrological interpretation
* Scientific visualization
* Computational simulation
* Modern web development

The platform serves as an educational bridge between theoretical calculus concepts and real-world environmental applications.

---

# 🛠️ Technologies

| Area                   | Technology              |
| ---------------------- | ----------------------- |
| Framework              | Next.js 14 (App Router) |
| UI                     | shadcn/ui + TailwindCSS |
| Mathematical Rendering | react-katex             |
| Visualization          | Recharts                |
| Styling                | TailwindCSS             |
| State Management       | Native React Hooks      |

---

# 📦 Installation

Clone the repository:

```bash
git clone https://github.com/moabdev/floodradar.git
cd floodradar
```

Install dependencies:

```bash
npm install
```

Run the project locally:

```bash
npm run dev
```

Open in browser:

```txt
http://localhost:3000
```

---

# 🧩 Project Structure

```txt
app/
 ├─ page.tsx                → Landing page
 ├─ dashboard/              → Academic dashboard
 ├─ simulacao/              → Interactive simulation
 ├─ modelo-matematico/      → Mathematical explanation
 ├─ explicacoes/            → Educational content
 └─ layout.tsx              → Navigation and theme
```

---

# 🎯 Academic Applications

FloodRadar is suitable for:

* Calculus I projects
* Numerical modeling demonstrations
* Hydrological simulations
* Applied mathematics presentations
* Scientific computing portfolios
* Engineering education

---

# 🔧 Customization

The project can be easily extended by modifying:

* Risk coefficients
* Differential equations
* Numerical methods
* Dashboard scenarios
* Visualization styles
* Hydrological parameters

---

# 🌌 Future Work

Planned future extensions include:

* Real-time sensor integration
* Machine learning flood prediction
* Expansion of numerical integration and dynamic modeling techniques to rocket trajectory and orbital simulation in aerospace systems

---

# 🌐 Deployment

The project is fully compatible with:

* Vercel
* Netlify
* Static hosting platforms

Deploy easily by connecting the repository to your preferred hosting provider.

---

# 📄 License

MIT License — free for educational, academic, and research purposes.
