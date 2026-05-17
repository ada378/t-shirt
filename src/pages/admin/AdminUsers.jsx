import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminUsers } from '../../features/admin/adminSlice';
import API from '../../services/api';
import { FiX, FiShoppingBag, FiMail, FiPhone, FiCalendar, FiMapPin } from 'react-icons/fi';

export default function AdminUsers() {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((s) => s.admin);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [userDetail, setUserDetail] = useState(null);

  useEffect(() => { dispatch(fetchAdminUsers()); }, [dispatch]);

  const openUserDetail = async (user) => {
    setSelectedUser(user);
    setOrdersLoading(true);
    try {
      const res = await API.get(`/admin/users/${user._id}`);
      setUserDetail(res.data.user);
      setUserOrders(res.data.orders || []);
    } catch {}
    setOrdersLoading(false);
  };

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
                <th className="text-left py-3 px-4 font-medium">Orders</th>
                <th className="text-left py-3 px-4 font-medium">Role</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr key={user._id} className="border-b border-neutral-50 hover:bg-neutral-50 cursor-pointer" onClick={() => openUserDetail(user)}>
                  <td className="py-3 px-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-xs font-medium">{user.name?.[0]}</div>
                    {user.name}
                  </td>
                  <td className="py-3 px-4 text-neutral-500">{user.email}</td>
                  <td className="py-3 px-4 text-neutral-500">{user.phone || '-'}</td>
                  <td className="py-3 px-4 text-neutral-500 text-xs">{new Date(user.createdAt).toLocaleDateString('en-IN')}</td>
                  <td className="py-3 px-4">{user.orderCount || user.ordersCount || '-'}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-neutral-100 text-neutral-700'}`}>
                      {user.role}
                    </span>
                  </td>
                </tr>
              ))}
              {(!users || users.length === 0) && (
                <tr><td colSpan={6} className="py-12 text-center text-neutral-400">No users found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedUser(null)}>
          <div className="bg-white rounded-sm w-full max-w-2xl max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-neutral-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center text-sm font-bold">{selectedUser.name?.[0]}</div>
                <div>
                  <h2 className="text-lg font-semibold">{selectedUser.name}</h2>
                  <p className="text-xs text-neutral-500">{selectedUser.email}</p>
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)} className="p-1 hover:bg-neutral-100 rounded-sm">
                <FiX className="text-lg" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-neutral-600"><FiMail /> {selectedUser.email}</div>
                <div className="flex items-center gap-2 text-neutral-600"><FiPhone /> {selectedUser.phone || '-'}</div>
                <div className="flex items-center gap-2 text-neutral-600"><FiCalendar /> Joined {new Date(selectedUser.createdAt).toLocaleDateString('en-IN')}</div>
                <div className="flex items-center gap-2 text-neutral-600"><FiShoppingBag /> {userOrders.length} orders</div>
              </div>

              {selectedUser.addresses?.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1"><FiMapPin /> Addresses</h4>
                  {selectedUser.addresses.map((addr, i) => (
                    <div key={i} className="text-sm p-3 bg-neutral-50 rounded-sm mb-2 border border-neutral-100">
                      <p className="font-medium">{addr.name}</p>
                      <p className="text-neutral-500">{addr.street}, {addr.city}, {addr.state} - {addr.zip}</p>
                      <p className="text-neutral-500">{addr.phone}</p>
                    </div>
                  ))}
                </div>
              )}

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-1"><FiShoppingBag /> Order History</h4>
                {ordersLoading ? (
                  <p className="text-sm text-neutral-400">Loading orders...</p>
                ) : userOrders.length > 0 ? (
                  <div className="space-y-2">
                    {userOrders.map((order) => (
                      <div key={order._id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-sm border border-neutral-100 text-sm">
                        <div>
                          <p className="font-mono text-xs font-medium">#{order._id?.slice(-8).toUpperCase()}</p>
                          <p className="text-xs text-neutral-500">{new Date(order.createdAt).toLocaleDateString('en-IN')} — {order.items?.length} items</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{order.totalAmount?.toLocaleString()}</p>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded ${order.orderStatus === 'delivered' ? 'bg-green-100 text-green-700' : order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {order.orderStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-neutral-400">No orders yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}