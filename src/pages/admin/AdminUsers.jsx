import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminUsers } from '../../features/admin/adminSlice';

export default function AdminUsers() {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((s) => s.admin);

  useEffect(() => { dispatch(fetchAdminUsers()); }, [dispatch]);

  return (
    <div>
      <h1 className="text-2xl font-display font-bold mb-6">Users</h1>

      <div className="bg-white border border-neutral-100 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 border-b border-neutral-100">
              <tr>
                <th className="text-left py-3 px-4 font-medium">Name</th>
                <th className="text-left py-3 px-4 font-medium">Email</th>
                <th className="text-left py-3 px-4 font-medium">Phone</th>
                <th className="text-left py-3 px-4 font-medium">Joined</th>
                <th className="text-left py-3 px-4 font-medium">Role</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr key={user._id} className="border-b border-neutral-50 hover:bg-neutral-50">
                  <td className="py-3 px-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-xs font-medium">{user.name?.[0]}</div>
                    {user.name}
                  </td>
                  <td className="py-3 px-4 text-neutral-500">{user.email}</td>
                  <td className="py-3 px-4 text-neutral-500">{user.phone || '-'}</td>
                  <td className="py-3 px-4 text-neutral-500 text-xs">{new Date(user.createdAt).toLocaleDateString('en-IN')}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-neutral-100 text-neutral-700'}`}>
                      {user.role}
                    </span>
                  </td>
                </tr>
              ))}
              {(!users || users.length === 0) && (
                <tr><td colSpan={5} className="py-12 text-center text-neutral-400">No users found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
