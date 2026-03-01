import {
  UpdateAvatarCard,
  UpdateNameCard,
  SessionsCard,
  DeleteAccountCard,
} from "@daveyplate/better-auth-ui";

export default function SettingsPage() {
  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col space-y-4">
          <h3 className="text-xl font-semibold">Profile</h3>
          <UpdateAvatarCard />
          <UpdateNameCard />
        </div>

        <div className="flex flex-col space-y-4">
          <h3 className="text-xl font-semibold">Security</h3>
          <SessionsCard />
          <DeleteAccountCard />
        </div>
      </div>
    </div>
  );
}
