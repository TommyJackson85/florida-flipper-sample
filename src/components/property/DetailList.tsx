type DetailItem = {
  label: string;
  value?: string | number | null;
};

type DetailListProps = {
  items: DetailItem[];
};

export function DetailList({ items }: DetailListProps) {
  return (
    <dl className="detail-grid">
      {items.map((item) => (
        <div key={item.label} className="detail-item">
          <dt>{item.label}</dt>
          <dd>
            {item.value === null || item.value === undefined || item.value === ""
              ? "—"
              : item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
