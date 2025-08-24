'use client';

export default function Footer() {
  return (
    <footer
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        padding: "0.6rem",
        backgroundImage: "linear-gradient(to right, #72BB34, #40A3DC)",
        color: "white",
        textAlign: "center",
        fontFamily: "sans-serif",
      }}
    >
      <p style={{ margin: 0, fontSize: "0.6rem" }}>
        Copyright © <strong>2025</strong> Angkasa Pura Indonesia I
      </p>
      <p style={{ margin: 4, fontSize: "0.6rem" }}>
        Dikembangkan oleh Program Magang Divisi Safety
      </p>
    </footer>
  );
}
