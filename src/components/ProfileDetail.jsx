import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { logout } from "@/redux/slices/userSlice";
import { useNavigate } from "react-router-dom";

export default function ProfileDetails() {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    location: "",
    altMobile: "",
    address:" ",
  });

  const [profileImg, setProfileImg] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        gender: user.gender || "",
        dob: user.dob || "",
        location: user.location || "",
        altMobile: user.altMobile || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImg(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    console.log("Updated Data:", formData);
    alert("Profile updated successfully!");
  };

  return (
    <div className="bg-white shadow p-6 rounded-md w-full">
      <h2 className="text-xl font-bold text-[#723248] mb-3">Profile Details</h2>

      {/* Profile Image */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src={profileImg || "/avatar.png"}
          alt="avatar"
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <Label htmlFor="photo" className="cursor-pointer text-[#723248]">
            ↑ Upload Photo
          </Label>
          <Input id="photo" type="file" onChange={handleImageUpload} className="hidden" />
        </div>
      </div>

      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" />
        <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="Mobile Number" />
        <Input name="email" value={formData.email} onChange={handleChange} placeholder="Email ID" />
        <Input name="gender" value={formData.gender} onChange={handleChange} placeholder="Gender" />
        <Input name="dob" value={formData.dob} onChange={handleChange} placeholder="Date of Birth" />
        <Input name="location" value={formData.location} onChange={handleChange} placeholder="Location" />
        <Input name="altMobile" value={formData.altMobile} onChange={handleChange} placeholder="Alternate Mobile" />
      </div>
      <Input className="grid grid-cols-1 mt-4" name="address" value={formData.address} onChange={handleChange} placeholder="Address" /> */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fullName" className="text-sm font-medium text-gray-700 mb-1 block">Full Name</Label>
          <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" />
        </div>

        <div>
          <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-1 block">Mobile Number</Label>
          <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="Mobile Number" />
        </div>

        <div>
          <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1 block">Email ID</Label>
          <Input id="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email ID" />
        </div>

        <div>
          <Label htmlFor="gender" className="text-sm font-medium text-gray-700 mb-1 block">Gender</Label>
          <Input id="gender" name="gender" value={formData.gender} onChange={handleChange} placeholder="Gender" />
        </div>

        <div>
          <Label htmlFor="dob" className="text-sm font-medium text-gray-700 mb-1 block">Date of Birth</Label>
          <Input id="dob" name="dob" value={formData.dob} onChange={handleChange} placeholder="Date of Birth" />
        </div>

        <div>
          <Label htmlFor="location" className="text-sm font-medium text-gray-700 mb-1 block">Location</Label>
          <Input id="location" name="location" value={formData.location} onChange={handleChange} placeholder="Location" />
        </div>

        <div>
          <Label htmlFor="altMobile" className="text-sm font-medium text-gray-700 mb-1 block">Alternate Mobile</Label>
          <Input id="altMobile" name="altMobile" value={formData.altMobile} onChange={handleChange} placeholder="Alternate Mobile" />
        </div>
      </div>

      <div className="mt-4">
        <Label htmlFor="address" className="text-sm font-medium text-gray-700 mb-1 block">Address</Label>
        <Input id="address" name="address" value={formData.address} onChange={handleChange} placeholder="Address" />
      </div>


      <div className="mt-6 flex gap-4">
        <Button onClick={handleSave} className="bg-[#723248] hover:bg-[#5a1e38] text-white">
          Save Changes
        </Button>
        <Button variant="outline" onClick={() =>{ 
          dispatch(logout()); 
          navigate("/"); 
          }}>
          Logout
        </Button>
      </div>
    </div>
  );
}