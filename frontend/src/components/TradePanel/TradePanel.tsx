import { useState, useRef, useEffect } from "react";
import "./TradePanel.css";

const PAIRS: { value: "BTC" | "ETH"; label: string }[] = [
    { value: "BTC", label: "BTC/USDT" },
    { value: "ETH", label: "ETH/USDT" },
];

function TradePanel() {
    const [side, setSide] = useState<"buy" | "sell">("buy");
    const [token, setToken] = useState<"BTC" | "ETH">("BTC");
    const [pairOpen, setPairOpen] = useState(false);
    const pairRef = useRef<HTMLDivElement>(null);
    const [amount, setAmount] = useState("");
    const [price, setPrice] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // NUMERIC(36, 18): up to 18 digits before the point, up to 18 after
    const NUMERIC_36_18 = /^\d{0,18}(\.\d{0,18})?$/;

    const handleNumericChange =
        (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            if (value === "" || NUMERIC_36_18.test(value)) {
                setter(value);
            }
        };

    const formatOnBlur = (value: string, setter: (v: string) => void) => {
        if (value === "" || value === ".") {
            setter("");
            return;
        }
        const num = Number(value);
        if (Number.isFinite(num)) {
            setter(num.toFixed(18));
        }
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (pairRef.current && !pairRef.current.contains(e.target as Node)) {
                setPairOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleTrade = async () => {
        setError(null);
        setSuccess(false);

        if (!amount || !price) {
            setError("Enter amount and price");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("http://localhost:8080/order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: 1,
                    side: side,
                    token: token,
                    amount: Number(amount).toFixed(18),
                    price: Number(price).toFixed(18),
                }),
            });

            if (!response.ok) {
                throw new Error(`Request failed: ${response.status}`);
            }

            setSuccess(true);
            setAmount("");
            setPrice("");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="trade-panel-card">
            <h1>Trade panel</h1>

            <div className="side-toggle">
                <button
                    className={`side-btn ${side === "buy" ? "active buy" : ""}`}
                    onClick={() => setSide("buy")}
                >
                    Buy
                </button>
                <button
                    className={`side-btn ${side === "sell" ? "active sell" : ""}`}
                    onClick={() => setSide("sell")}
                >
                    Sell
                </button>
            </div>

            <div className="field">
                <label>Pair</label>
                <div className="custom-select" ref={pairRef}>
                    <button
                        type="button"
                        className={`custom-select-trigger ${pairOpen ? "open" : ""}`}
                        onClick={() => setPairOpen((v) => !v)}
                    >
                        <span>{PAIRS.find((p) => p.value === token)?.label}</span>
                        <svg
                            className="chevron"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </button>

                    {pairOpen && (
                        <ul className="custom-select-options">
                            {PAIRS.map((pair) => (
                                <li
                                    key={pair.value}
                                    className={`custom-select-option ${
                                        pair.value === token ? "selected" : ""
                                    }`}
                                    onClick={() => {
                                        setToken(pair.value);
                                        setPairOpen(false);
                                    }}
                                >
                                    {pair.label}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <div className="field">
                <label>Amount</label>
                <input
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={amount}
                    onChange={handleNumericChange(setAmount)}
                    onBlur={() => formatOnBlur(amount, setAmount)}
                />
            </div>

            <div className="field">
                <label>Price</label>
                <input
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={price}
                    onChange={handleNumericChange(setPrice)}
                    onBlur={() => formatOnBlur(price, setPrice)}
                />
            </div>

            {error && <p className="message error-message">{error}</p>}
            {success && <p className="message success-message">Order created</p>}

            <button className="trade-btn" onClick={handleTrade} disabled={loading}>
                {loading ? "Placing order..." : `${side === "buy" ? "Buy" : "Sell"} ${token}`}
            </button>
        </div>
    );
}

export default TradePanel;