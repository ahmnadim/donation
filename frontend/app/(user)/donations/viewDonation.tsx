import { Button, Descriptions, Modal } from "antd";
import { useRouter } from "next/navigation";

export default function ViewDonation({
  selectedDonation,
  setSelectedDonation,
}: any) {
  const router = useRouter();
  return (
    <Modal
      title="Donation Details"
      open={!!selectedDonation}
      onCancel={() => setSelectedDonation(null)}
      footer={[
        <Button key="close" onClick={() => setSelectedDonation(null)}>
          Close
        </Button>,
      ]}
      width={600}
    >
      {selectedDonation && (
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Donor Name">
            {selectedDonation?.donor?.name}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {selectedDonation?.donor?.email}
          </Descriptions.Item>
          <Descriptions.Item label="Amount">
            ${selectedDonation.amount.toFixed(2)}
          </Descriptions.Item>
          <Descriptions.Item label="Purpose">
            {selectedDonation?.program?.name}
          </Descriptions.Item>
          <Descriptions.Item label="Currency">
            {selectedDonation?.currency}
          </Descriptions.Item>
          <Descriptions.Item label="Date">
            {new Date(selectedDonation.createdAt).toLocaleString()}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
}
